module.exports = function (User, secret) {

    var passport = require("passport");
    var BasicStrategy = require("passport-http").BasicStrategy;
    var BearerStrategy = require("passport-http-bearer").Strategy;
    var jwt = require("jsonwebtoken");
    var jwt_secret = secret;

    var auth_return = function(user) {
        return {
            "user_name" : user.user_name,
            "_id" : user._id,
            "status" : user.status
        };
    };

    passport.use(new BasicStrategy(
        function (user_name, password, callback) {
            User.find({ "user_name" : user_name })
                .limit(1)
                .exec(function (err, user) {
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

    passport.use(new BearerStrategy(
        function (token, callback) {
            try {
                jwt.verify(token, jwt_secret, function (err, decoded) {
                    if(err) {
                        return callback(err);
                    }
                    User.find({ "user_name" : decoded })
                        .limit(1)
                        .exec(function (err, user) {
                            user = user[0];
                            if(err) {
                                return callback(err);
                            }
                            if(!user) {
                                return callback(null, false);
                            } else {
                                callback(null, auth_return(user), { "scope" : "*" });
                            }
                        });
                });
            } catch(err) {
                return callback(null, false);
            }
        }
    ));

    var verify_token = function (token, callback) {
        jwt.verify(token, jwt_secret, function (err, decoded) {
            if(err) {
                return callback(false, err);
            }
            User.find({ "user_name" : decoded })
                .limit(1)
                .exec(function (err, user) {
                    user = user[0];
                    if(err) {
                        return callback(false, err);
                    }
                    if(!user) {
                        return callback(false, "User not found");
                    } else {
                        callback(true, auth_return(user));
                    }
                });
        });
    };

    return {
        "passport_init" : passport.initialize(),
        "jwt" : jwt,
        "jwt_secret" : jwt_secret,
        "verify_token" : verify_token,
        "isAuthenticated" : passport.authenticate(["basic", "bearer"], { "session" : false }),
        "isBearerAuthenticated" : passport.authenticate("bearer", { "session" : false })
    }

};
