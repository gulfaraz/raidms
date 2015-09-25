module.exports = function (util, router, User, auth) {

    var social_callback_function = function (network) {
        return (function (req, res, next) {
            auth.passport.authenticate(network, function (err, user, info) {
                if(err) {
                    res.redirect(util.config.scheme + "://" + util.config.domain + "/#/message/" + err.toString());
                } else {
                    if(!user) {
                        res.redirect(util.config.scheme + "://" + util.config.domain + "/#/message/" + "User Not Found");
                    } else {
                        req.logIn(user, function (err) {
                            if(err) {
                                res.redirect(util.config.scheme + "://" + util.config.domain + "/#/message/" + encodeURL(err.toString()));
                            } else {
                                res.redirect(util.config.scheme + "://" + util.config.domain + "/#/signIn/" + req.user.user_name + "/" + req.user.token);
                            }
                        });
                    }
                }
            })(req, res, next);
        });
    };

    router.get("/auth/facebook", auth.passport.authenticate("facebook", { "scope" : [ "public_profile", "email", "user_friends" ] }));

    router.get("/auth/facebook/callback", social_callback_function("facebook"));

    router.get("/auth/twitter", auth.passport.authenticate("twitter", { "scope" : [ "public_profile", "email", "user_friends" ] }));

    router.get("/auth/twitter/callback", social_callback_function("twitter"));

    router.get("/auth/google", auth.passport.authenticate("google", { "scope" : [ "https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/plus.profile.emails.read" ] }));

    router.get("/auth/google/callback", social_callback_function("google"));

    router.get("/auth/xbox", auth.passport.authenticate("windowslive", { "scope" : [ "wl.signin", "wl.basic", "wl.emails" ] }));

    router.get("/auth/xbox/callback", social_callback_function("windowslive"));

    router.get("/api/unlink/:social_account", auth.passport.authenticate("bearer"), function (req, res, next) {
        User.find({ "_id" : req.user.user_id })
            .limit(1)
            .exec(function (err, user) {
                user = user[0];
                if(user) {
                    if(err) {
                        res.json({
                            "success" : false,
                            "message" : err.toString()
                        });
                    } else {
                        if(user.status === "active" && req.user.user_id.toString() === user._id.toString()) {
                            user.social[req.params.social_account].linked = false;
                        }
                        user.markModified("social");
                        user.save(function (err) {
                            if(err) {
                                res.json({
                                    "success" : false,
                                    "message" : err.toString()
                                });
                            } else {
                                res.json({
                                    "success" : true,
                                    "message" : "Account Unlinked",
                                    "social" : user.social
                                });
                            }
                        });
                    }
                } else {
                    res.json({
                        "success" : false,
                        "message" : "User Not Found"
                    });
                }
            });
    });

    return router;
}
