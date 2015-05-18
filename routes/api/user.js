module.exports = function (util, router, User, auth) {
    var select = 'user_name mail role status caption karma play_start play_end platforms seeking date_joined date_updated social delete timezone';
    router.route('/api/user')
        .post(function (req, res) {
            var user = new User();
            user.user_name = req.body.user_name;
            user.password = req.body.password;
            user.mail = req.body.mail;
            user.role = 'applicant';
            user.status = 'registered';
            user.karma = 0;
            user.date_joined = Date.now();
            user.date_updated = Date.now();
            user.play_start = Date.now();
            user.play_end = Date.now();
            user.save(function (err) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'message' : 'User created' });
                    var validation_token = auth.jwt.sign(user.user_name, auth.jwt_secret, {
                        expiresInMinutes: (60 * 24)
                    });
                    util.sendRegistrationMail(user.mail, validation_token);
                }
            });
        })
        .get(function (req, res) {
            User.find().select(select).exec(function (err, user) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'data' : user });
                }
            });
        });
    router.route('/api/user/:user_id')
        .get(function (req, res) {
            var query = { 'user_name' : req.params.user_id };
            if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { '_id' : req.params.user_id };
            }
            User.find(query).limit(1).select(select).exec(function (err, user) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'data' : user });
                }
            });
        })
        .post(auth.isAuthenticated, function (req, res) {
            var query = { 'user_name' : req.params.user_id };
            if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { '_id' : req.params.user_id };
            }
            User.find(query).limit(1).exec(function (err, user) {
                user = user[0];
                if(user) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        user.user_name = req.body.user_name;
                        user.password = req.body.password || user.password;
                        user.mail = req.body.mail || user.mail;
                        user.role = req.body.role || user.role;
                        user.status = req.body.status || user.status;
                        user.caption = (typeof req.body.caption == 'undefined') ? user.caption : req.body.caption;
                        user.karma = req.body.karma || user.karma;
                        user.play_start = req.body.play_start || user.play_start;
                        user.play_end = req.body.play_end || user.play_end;
                        user.platforms = req.body.platforms || user.platforms;
                        if(req.body.seeking) {
                            user.seeking = {
                                'platform' : (typeof req.body.seeking.platform == 'undefined') ? user.seeking.platform : req.body.seeking.platform,
                                'game' : (typeof req.body.seeking.game == 'undefined') ? user.seeking.game : req.body.seeking.game,
                                'message' : (typeof req.body.seeking.message == 'undefined') ? user.seeking.message : req.body.seeking.message
                            };
                        }
                        user.timezone = req.body.timezone || user.timezone;
                        user.date_updated = Date.now();
                        user.delete = req.body.delete;
                        if(req.body.mail) {
                            var validation_token = auth.jwt.sign({ 'user_name' : user.user_name, 'mail' : req.body.mail }, auth.jwt_secret, {
                                expiresInMinutes: (60 * 24)
                            });
                            util.sendMailChangeMail(req.body.mail, validation_token);
                            res.json({ 'success' : true, 'message' : 'Verification Mail Sent' });
                        } else {
                            user.save(function (err) {
                                if(err) {
                                    res.json({ 'success' : false, 'message' : err.toString() });
                                } else if(req.body.delete) {
                                    util.sendAccountTerminationMail(user.mail, user.user_name);
                                    res.json({ 'success' : true, 'message' : 'Scheduled for termination. You data will be erased in 24 hours.' });
                                } else {
                                    res.json({ 'success' : true, 'message' : 'User updated' });
                                }
                            }); 
                        }
                    }
                } else {
                    res.json({ 'success' : false, 'message' : 'User Not Found' });
                }
            });
        })
        .delete(auth.isAuthenticated, function (req, res) {
            var query = { 'user_name' : req.params.user_id };
            if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { '_id' : req.params.user_id };
            }
            User.find(query).limit(1).remove(function (err, user) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'message' : 'User deleted' });
                }
            });
        });
    router.post('/api/login',function (req, res) {
        User.find({
            'user_name' : req.body.user_name
        }).limit(1).exec(function (err, user) {
            user = user[0];
            if(err) {
                res.json({ 'success' : false, 'message' : err.toString() });
            };
            if(!user) {
                res.json({ 'success' : false, 'message' : 'Invalid user_name' });
            } else if(user) {
                user.verifyPassword(req.body.password, function (err, isMatch) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    }
                    if(!isMatch) {
                        res.json({ 'success' : false, 'message' : 'Invalid password' });
                    } else {
                        var token = auth.jwt.sign(user.user_name, auth.jwt_secret, {
                            expiresInMinutes: (60 * 24 * 14)
                        });
                        res.json({ 'success' : true, 'message' : 'User Authenticated', 'token' : token, 'user_name' : user.user_name });
                    }
                });
            }
        });
    });
    router.post('/api/login/:token', auth.isBearerAuthenticated,function (req, res) {
        if(req.user) {
            res.json({ 'success': true, 'message': 'User Authenticated', 'user_name' : req.user.user_name });
        } else {
            res.json({ 'success': false, 'message': 'Invalid Token' });
        }
    });

    router.get('/api/check/:query', function (req, res) {
        var query = { 'user_name' : req.params.query };
        if(util.validateEmail(req.params.query)) {
            query = { 'mail' : req.params.query };
        }
        User.find(query).exec(function (err, user) {
            if(err) {
                res.json({ 'success' : false, 'message' : err.toString() });
            } else {
                if(user.length > 0) {
                    res.json({ 'success' : true, 'available' : false, 'data' : user[0].user_name });
                } else {
                    res.json({ 'success' : true, 'available' : true });
                }
            }
        });
    });

    router.get('/registration/:token', function (req, res) {
        auth.jwt.verify(req.params.token, auth.jwt_secret, function (err, decoded) {
            if(err || !decoded) {
                res.json({ 'success' : false, 'message' : 'Invalid Token' });
            } else {
                var query = { 'user_name' : decoded };
                User.find(query).limit(1).exec(function (err, user) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        user = user[0];
                        if(user && user.status && user.status == "registered") {
                            user.status = "active";
                            user.save(function (err) {
                                if(err) {
                                    res.json({ 'success' : false, 'message' : err.toString() });
                                } else {
                                    res.redirect(util.config.protocol + util.config.domain + '#/user/' + user.user_name);
                                }
                            });
                        } else {
                            res.json({ 'success' : false, 'message' : 'Invalid Token' });
                        }
                    }
                });
            }
        });
    });

    router.get('/mail/:token', function (req, res) {
        auth.jwt.verify(req.params.token, auth.jwt_secret, function (err, decoded) {
            if(err || !decoded) {
                res.json({ 'success' : false, 'message' : 'Invalid Token' });
            } else {
                var query = { 'user_name' : decoded.user_name };
                User.find(query).limit(1).exec(function (err, user) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        user = user[0];
                        user.user_name = decoded.user_name;
                        user.mail = decoded.mail;
                        user.password = user.password;
                        user.save(function (err) {
                            if(err) {
                                res.json({ 'success' : false, 'message' : err.toString() });
                            } else {
                                res.redirect(util.config.protocol + util.config.domain + '#/user/' + user.user_name);
                            }
                        });
                    }
                });
            }
        });
    });

    return router;
}
