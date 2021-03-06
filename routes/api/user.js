module.exports = function (util, router, User, auth) {
    var select = "user_name mail role status caption karma play_start play_end platforms seeking date_joined date_updated social delete timezone";
    var except = "mail status social delete timezone";
    router.route("/")
        .post(function (req, res) {
            var user = new User();
            user.user_name = req.body.user_name;
            user.password = req.body.password;
            user.mail = req.body.mail;
            user.timezone = req.body.timezone;
            user.role = "new";
            user.status = "active";
            user.seeking = {
                "platform" : null,
                "game" : null
            };
            user.karma = 0;
            user.date_joined = Date.now();
            user.date_updated = Date.now();
            user.play_start = Date.now() - (1000 * 60 * 60);
            user.play_end = Date.now() + (1000 * 60 * 60 * 2);
            user.save(function (err) {
                if(err) {
                    res.json({
                        "success" : false,
                        "message" : err.toString()
                    });
                } else {
                    res.json({
                        "success" : true,
                        "message" : "User Created",
                        "token" : auth.jwt.generate_token(user._id),
                        "user_name" : user.user_name,
                        "_id" : user._id
                    });
                    util.sendRegistrationMail(user.mail, auth.jwt.generate_token(user._id, (60 * 24)));
                    req.logIn(user);
                }
            });
        })
        .get(function (req, res) {
            User.find()
                .select(select)
                .exec(function (err, user) {
                    if(err) {
                        res.json({
                            "success" : false,
                            "message" : err.toString()
                        });
                    } else {
                        for(var i=0; i<user.length; i++) {
                            user[i] = util.except(user[i], except.split(" "));
                            if(!user[i].user_name) {
                                user[i].user_name = user[i]._id;
                            }
                        }
                        res.json({
                            "success" : true,
                            "data" : user
                        });
                    }
                });
        });
    router.route("/:user_id")
        .get(function (req, res) {
            var authorization_header = req.get("Authorization") || "";
            var verify_user = auth.jwt.verify_token(authorization_header.split(" ")[1], function (status, data) {
                var query = { "user_name" : req.params.user_id };
                if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                    query = { "_id" : req.params.user_id };
                }
                User.find(query)
                    .limit(1)
                    .select(select)
                    .exec(function (err, user) {
                        user = user[0];
                        if(user) {
                            if(err) {
                                res.json({
                                    "success" : false,
                                    "message" : err.toString()
                                });
                            } else {
                                if(!status || user.status !== "active" || data.user_id.toString() !== user._id.toString()) {
                                    user = util.except(user, except.split(" "));
                                }
                                if(!user.user_name) {
                                    user.user_name = user._id;
                                }
                                res.json({
                                    "success" : true,
                                    "data" : user
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
        })
        .post(auth.passport.authenticate("bearer"), function (req, res) {
            var query = { "user_name" : req.params.user_id };
            if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { "_id" : req.params.user_id };
            }
            User.find(query)
                .limit(1)
                .exec(function (err, user) {
                    if(err) {
                        res.json({
                            "success" : false,
                            "message" : err.toString()
                        });
                    } else {
                        user = user[0];
                        if(user) {
                            if(req.user.user_id.toString() === user._id.toString()) {
                                user.user_name = req.body.user_name;
                                user.password = req.body.password || user.password;
                                user.mail = req.body.mail || user.mail;
                                user.role = req.body.role || user.role;
                                user.status = req.body.status || user.status;
                                user.caption = (req.body.caption || req.body.caption === "") ? req.body.caption : user.caption;
                                user.karma = req.body.karma || user.karma;
                                user.play_start = req.body.play_start || user.play_start;
                                user.play_end = req.body.play_end || user.play_end;
                                user.platforms = req.body.platforms || user.platforms;
                                if(req.body.seeking) {
                                    user.seeking = {
                                        "platform" : (req.body.seeking.platform || req.body.seeking.platform === null) ? req.body.seeking.platform : user.seeking.platform,
                                        "game" : (req.body.seeking.game || req.body.seeking.game === null) ? req.body.seeking.game : user.seeking.game,
                                        "message" : (req.body.seeking.message || req.body.seeking.message === null) ? req.body.seeking.message : user.seeking.message
                                    };
                                }
                                user.timezone = req.body.timezone || user.timezone;
                                user.date_updated = Date.now();
                                user.delete = req.body.delete;
                                if(req.body.mail) {
                                    util.sendMailChangeMail(req.body.mail, auth.jwt.generate_token({
                                        "user_id" : user._id,
                                        "mail" : req.body.mail
                                    }));
                                    res.json({
                                        "success" : true,
                                        "message" : "Verification Mail Sent"
                                    });
                                } else {
                                    user.save(function (err) {
                                        if(err) {
                                            res.json({
                                                "success" : false,
                                                "message" : err.toString()
                                            });
                                        } else if(req.body.delete) {
                                            util.sendAccountTerminationMail(user.mail, user.user_name);
                                            res.json({
                                                "success" : true,
                                                "message" : "Scheduled for termination. You data will be erased in 24 hours."
                                            });
                                        } else {
                                            res.json({
                                                "success" : true,
                                                "message" : "User Updated"
                                            });
                                        }
                                    });
                                }
                            } else {
                                res.json({
                                    "success" : false,
                                    "message" : "Unauthorized"
                                });
                            }
                        } else {
                            res.json({
                                "success" : false,
                                "message" : "User Not Found"
                            });
                        }
                    }
                });
        });
    return router;
}
