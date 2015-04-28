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

passport.use(new FacebookStrategy({ 'clientID' : 'FACEBOOK_APP_ID', 'clientSecret' : 'FACEBOOK_APP_SECRET', 'callbackURL' : 'http://54.169.119.195:8080/auth/facebook/callback' },
    function (access_token, refresh_token, profile, done) {
        User.findOrCreate({ 'social.facebook' :  profile.id }, function (err, user) {
            if(err) {
                return done(err);
            }
            done(null, user);
        });
    }
));

passport.use(new TwitterStrategy({ 'consumerKey' : 'TWITTER_CONSUMER_KEY', 'consumerSecret' : 'TWITTER_CONSUMER_SECRET', 'callbackURL': "http://54.169.119.195:8080/auth/twitter/callback" },
    function (token, token_secret, profile, done) {
        User.findOrCreate({ 'social.twitter' :  profile.id }, function (err, user) {
            if(err) {
                return done(err);
            }
            done(null, user);
        });
    }
));

passport.use(new GoogleStrategy({ 'clientID' : 'GOOGLE_CLIENT_ID', 'clientSecret' : 'GOOGLE_CLIENT_SECRET', 'callbackURL' : "http://54.169.119.195:8080/auth/google/callback", 'passReqToCallback' : true },
    function (request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({ 'social.google' : profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

var redirects = { 'successRedirect' : '#/list', 'failureRedirect' : '#/list' };

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { 'session' : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { 'session' : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { 'session' : false });
exports.isFacebookAuthenticated = passport.authenticate('facebook', { 'session' : false });
exports.isFacebookAuthenticatedCallback = passport.authenticate('facebook', redirects, { 'session' : false });
exports.isTwitterAuthenticated = passport.authenticate('twitter', { 'session' : false });
exports.isTwitterAuthenticatedCallback = passport.authenticate('twitter', redirects, { 'session' : false });
exports.isGoogleAuthenticated = passport.authenticate('google', { 'scope' :  [ 'https://www.googleapis.com/auth/plus.login' ] }, { 'session' : false });
exports.isGoogleAuthenticatedCallback = passport.authenticate('google', redirects, { 'session' : false });
