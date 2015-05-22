var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var models = require('./models');
var User = models.User;
var Client = models.Client;
var Token = models.Token;
var jwt = require('jsonwebtoken');
var jwt_secret = 'gulfaraz';

var auth_return = function(user) {
    return { 'user_name' : user.user_name, '_id' : user._id, 'status' : user.status };
};

passport.use(new BasicStrategy(
    function (user_name, password, callback) {
        User.find({ 'user_name' : user_name }).limit(1).exec(function (err, user) {
            user = user[0];
            if(err) {
                return callback(err);
            }
            if(!user) {
                return callback(null, false);
            }
            user.verifyPassword(password, function (err, isMatch) {
              if(err) {
                  return callback(err);
              }
              if(!isMatch) {
                  return callback(null, false);
              }
              return callback(null, auth_return(user));
            });
        });
    }
));

passport.use('client-basic', new BasicStrategy(
    function (user_name, password, callback) {
        Client.find({ 'id' : user_name }).limit(1).exec(function (err, client) {
            client = client[0];
            if(err) {
                return callback(err);
            }
            if(!client || client.secret !== password) {
                return callback(null, false);
            }
            return callback(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function (token, callback) {
        try {
            jwt.verify(token, jwt_secret, function (err, decoded) {
                if(err) {
                    return callback(err);
                }
                User.find({ 'user_name' : decoded }).limit(1).exec(function (err, user) {
                    user = user[0];
                    if(err) {
                        return callback(err);
                    }
                    if(!user) {
                        return callback(null, false);
                    } else {
                        callback(null, auth_return(user), { 'scope' : '*' });
                    }
                });
            });
        } catch(err) {
            return callback(null, false);
        }
    }
));

passport.use('oauth-bearer', new BearerStrategy(
    function (access_token, callback) {
        Token.find({ 'value' : access_token }).limit(1).exec(function (err, token) {
            token = token[0];
            if(err) {
                return callback(err);
            }
            if(!token) {
                return callback(null, false);
            }
            User.find({ '_id': token.user_id }).limit(1).exec(function (err, user) {
                user = user[0];
                if(err) {
                    return callback(err);
                }
                if(!user) {
                    return callback(null, false);
                }
                callback(null, auth_return(user), { 'scope' : '*' });
            });
        });
    }
));

var verify_token = function (token, callback) {
    jwt.verify(token, jwt_secret, function (err, decoded) {
        if(err) {
            return callback(false, err);
        }
        User.find({ 'user_name' : decoded }).limit(1).exec(function (err, user) {
            user = user[0];
            if(err) {
                return callback(false, err);
            }
            if(!user) {
                return callback(false, 'User not found');
            } else {
                callback(true, auth_return(user));
            }
        });
    });
};

exports.oauth2 = require('./oauth2');
exports.passport_init = passport.initialize();
exports.jwt = jwt;
exports.jwt_secret = jwt_secret;
exports.verify_token = verify_token;
exports.isAuthenticated = passport.authenticate(['basic', 'bearer', 'oauth-bearer'], { 'session' : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { 'session' : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { 'session' : false });
exports.isOAuthBearerAuthenticated = passport.authenticate('oauth-bearer', { 'session' : false });
