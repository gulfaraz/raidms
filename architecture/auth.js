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

passport.use(new BasicStrategy(
    function (username, password, callback) {
        User.findOne({ 'username' : username }, function (err, user) {
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
              return callback(null, user);
            });
        });
    }
));

passport.use('client-basic', new BasicStrategy(
    function (username, password, callback) {
        Client.findOne({ 'id' : username }, function (err, client) {
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
                User.findOne({ 'username' : decoded }, function (err, user) {
                    if(err) {
                        return callback(err);
                    }
                    if(!user) {
                        return callback(null, false);
                    } else {
                        callback(null, user, { 'scope' : '*' });
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
        Token.findOne({ 'value' : access_token }, function (err, token) {
            if(err) {
                return callback(err);
            }
            if(!token) {
                return callback(null, false);
            }
            User.findOne({ '_id': token.user_id }, function (err, user) {
                if(err) {
                    return callback(err);
                }
                if(!user) {
                    return callback(null, false);
                }
                callback(null, user, { 'scope' : '*' });
            });
        });
    }
));

exports.oauth2 = require('./oauth2');
exports.passport_init = passport.initialize();
exports.jwt = jwt;
exports.jwt_secret = jwt_secret;
exports.isAuthenticated = passport.authenticate(['basic', 'bearer', 'oauth-bearer'], { 'session' : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { 'session' : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { 'session' : false });
exports.isOAuthBearerAuthenticated = passport.authenticate('oauth-bearer', { 'session' : false });
