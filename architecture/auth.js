module.exports = function (util, User, secret, social) {

    var passport = require("passport");
    var BearerStrategy = require("passport-http-bearer").Strategy;
    var LocalStrategy = require("passport-local").Strategy;
    var FacebookStrategy = require("passport-facebook").Strategy;
    var TwitterStrategy  = require("passport-twitter").Strategy;
    var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
    var WindowsStrategy = require("passport-windowslive").Strategy;
    var jwt = require("jsonwebtoken");

    jwt.secret = secret;

    jwt.generate_token = function (decoded, expires) {
        return jwt.sign(decoded, jwt.secret, { "expiresInMinutes" : ((expires) ? expires : (60 * 24 * 14)) });
    };

    jwt.verify_token = function (token, callback) {
        jwt.verify(token, jwt.secret, function (err, decoded) {
            if(err) {
                callback(false, err);
            } else {
                User.findById(decoded)
                    .exec(function (err, user) {
                        if(err) {
                            callback(false, err);
                        } else {
                            if(!user) {
                                callback(false, "User not found");
                            } else {
                                callback(true, auth_return(user));
                            }
                        }
                    });
            }
        });
    };

    passport.serializeUser(function (user, callback) {
        callback(null, user.user_id);
    });

    passport.deserializeUser(function (id, callback) {
        User.findById(id, function (err, user) {
            callback(err, user);
        });
    });

    var auth_return = function(user, token) {
        user = {
            "user_name" : user.user_name || user._id,
            "user_id" : user._id,
            "role" : user.role,
            "token" : jwt.generate_token(user._id)
        };
        return user;
    };

    passport.use("local", new LocalStrategy({
        "usernameField" : "user_name",
        "passwordField" : "password",
        "passReqToCallback" : true
    }, function (req, user_name, password, callback) {
        process.nextTick(function () {
                var query = { "user_name" : user_name };
                if(util.validateEmail(user_name)) {
                    query = { "mail" : user_name };
                }
                User.find(query)
                    .limit(1)
                    .exec(function (err, user) {
                        if(err) {
                            callback(err.toString());
                        } else {
                            user = user[0];
                            if(!user) {
                                callback("User Not Found");
                            } else {
                                user.verifyPassword(password, function (err, isMatch) {
                                    if(err) {
                                        callback(err.toString());
                                    } else {
                                        if(!isMatch) {
                                            callback("Invalid Passcode");
                                        } else {
                                            callback(null, auth_return(user));
                                        }
                                    }
                                });
                            }
                        }
                    });
        });
    }));

    passport.use(new BearerStrategy(function (token, callback) {
            process.nextTick(function () {
                try {
                    jwt.verify(token, jwt.secret, function (err, decoded) {
                        if(err) {
                            callback(err);
                        } else {
                            User.find({ "_id" : decoded })
                                .limit(1)
                                .exec(function (err, user) {
                                    if(user) {
                                        user = user[0];
                                        if(err) {
                                            callback(err);
                                        } else {
                                            if(!user) {
                                                callback(null, false);
                                            } else {
                                                if(user.status === "active") {
                                                    var permissions = { "scope" : "read" };
                                                    if(user.role === "member") {
                                                        permissions.scope = "edit";
                                                    } else if(user.role === "moderator") {
                                                        permissions.scope = "manage";
                                                    } else if(user.role === "super") {
                                                        permissions.scope = "*";
                                                    }
                                                    callback(null, auth_return(user), permissions);
                                                } else {
                                                    callback(null, false);
                                                }
                                            }
                                        }
                                    } else {
                                        callback(null, false);
                                    }
                                });
                        }
                    });
                } catch(err) {
                    callback(null, false);
                }
            });
        }));

    var oauth_configuration = function (configuration) {
        configuration.passReqToCallback = true;
        return configuration;
    };

    passport.use(new FacebookStrategy(oauth_configuration(social.facebook),
        function (req, accessToken, refreshToken, profile, callback) {
            process.nextTick(function () {
                social_linker("facebook", req, profile, callback);
            });
        }
    ));

    passport.use(new TwitterStrategy(oauth_configuration(social.twitter),
        function (req, token, tokenSecret, profile, callback) {
            process.nextTick(function () {
                social_linker("twitter", req, profile, callback);
            });
        }));

    passport.use(new GoogleStrategy(oauth_configuration(social.google),
        function (req, token, refreshToken, profile, callback) {
            process.nextTick(function () {
                social_linker("google", req, profile, callback);
            });
        }));

    passport.use(new WindowsStrategy(oauth_configuration(social.xbox),
        function (req, accessToken, refreshToken, profile, callback) {
            process.nextTick(function () {
                social_linker("xbox", req, profile, callback);
            });
        }));

    function social_linker(network, req, profile, callback) {
        var social_object = {};
        social_object["id"] = profile.id;
        social_object["linked"] = true;
        if(profile.emails) {
            social_object["email"] = profile.emails[0].value;
        }
        if(req.session.passport.user) {
            var query = {};
            query["social." + network + ".id"] = profile.id;
            User.find(query)
                .limit(1)
                .exec(function (err, exists) {
                    if(exists.length < 2) {
                        if(exists.length === 0 || exists[0]._id.toString() === req.session.passport.user) {
                            User.findById(req.session.passport.user, function (err, user) {
                                if(user) {
                                    if(!util.get_sub_property(user, "social")) {
                                        user.social = {};
                                    }
                                    user.social[network] = social_object;
                                    if(!user.mail && profile.emails) {
                                        user.mail = profile.emails[0].value;
                                    }
                                    user.markModified("social");
                                    user.save(function (err) {
                                        if(err) {
                                            callback(false, err.toString());
                                        } else {
                                            if(user.mail) {
                                                util.sendSocialAccount(user.mail, util.capitalize(network), true);
                                            }
                                        }
                                    });
                                    callback(null, auth_return(user));
                                } else {
                                    callback("User Not Found");
                                }
                            });
                        } else {
                            callback("This " + util.capitalize(network) + " ID is linked to a different account.");
                        }
                    } else {
                        callback("This " + util.capitalize(network) + " ID is linked to multiple accounts.");
                    }
                });
        } else {
            var query = {};
            if(profile.emails) {
                var conditions = [];
                conditions[0] = { "mail" : profile.emails[0].value };
                conditions[1] = {};
                conditions[1]["social." + network + ".id"] = profile.id;
                query["$or"] = conditions;
            } else {
                query["social." + network + ".id"] = profile.id;
            }
            User.find(query)
                .limit(1)
                .exec(function (err, user) {
                    user = user[0];
                    if(err) {
                        callback(err);
                    } else {
                        if(!user) {
                            var user = new User();
                            if(profile.emails) {
                                user.mail = profile.emails[0].value;
                            }
                            user.role = "member";
                            user.status = "active";
                            user.seeking = {
                                "platform" : null,
                                "game" : null
                            };
                            user.social = {};
                            user.social[network] = social_object;
                            user.karma = 0;
                            user.date_joined = Date.now();
                            user.date_updated = Date.now();
                            user.play_start = Date.now() - (1000 * 60 * 60);
                            user.play_end = Date.now() + (1000 * 60 * 60 * 2);
                            user.markModified("social");
                            user.save(function (err) {
                                if(err) {
                                    callback(err.toString());
                                } else {
                                    if(user.mail) {
                                        util.sendRegistrationMail(user.mail);
                                    }
                                    callback(null, auth_return(user));
                                }
                            });
                        } else {
                            if(util.get_sub_property(user, "social", network, "linked") !== true) {
                                if(!util.get_sub_property(user, "social")) {
                                    user.social = {};
                                }
                                user.social[network] = social_object;
                                user.markModified("social");
                                user.save(function (err) {
                                    if(err) {
                                        callback(false, err.toString());
                                    } else {
                                        util.sendSocialAccount(user.mail, util.capitalize(network), true);
                                    }
                                });
                            }
                            callback(null, auth_return(user));
                        }
                    }
                });
        }
    }

    return {
        "jwt" : jwt,
        "passport" : passport
    }

};
