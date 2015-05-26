module.exports = function (util, express, User, auth) {
    var router = express.Router();
    var select = 'user_name mail role status caption karma play_start play_end platforms seeking date_joined date_updated social delete timezone';
    var except = 'mail status social delete timezone';
    router.route('/')
        .post(function (req, res) {
            var user = new User();
            user.user_name = req.body.user_name;
            user.password = req.body.password;
            user.mail = req.body.mail;
            user.timezone = req.body.timezone;
            user.role = 'applicant';
            user.status = 'registered';
            user.seeking = {
                'platform' : '',
                'game' : ''
            };
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
                    for(var i=0; i<user.length; i++) {
                        user[i] = util.except(user[i], except.split(' '));
                    }
                    res.json({ 'success' : true, 'data' : user });
                }
            });
        });
    router.route('/:user_id')
        .get(function (req, res) {
            var authorization_header = req.get('Authorization') || '';
            var verify_user = auth.verify_token(authorization_header.split(' ')[1], function (status, data) {
                var query = { 'user_name' : req.params.user_id };
                if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                    query = { '_id' : req.params.user_id };
                }
                User.find(query).limit(1).select(select).exec(function (err, user) {
                    user = user[0];
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        if(status && data.user_name == user.user_name) {
                        } else {
                            user = util.except(user, except.split(' '));
                        }
                        res.json({ 'success' : true, 'data' : user });
                    }
                });
            });
        })
        .post(auth.isAuthenticated, function (req, res) {
            var query = { 'user_name' : req.params.user_id };
            if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { '_id' : req.params.user_id };
            }
            User.find(query).limit(1).exec(function (err, user) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    user = user[0];
                    if(user) {
                        if(req.user.user_name == user.user_name) {
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
                                    'platform' : ((typeof req.body.seeking.platform == 'string' && (req.body.seeking.platform.length > 0) ) ? req.body.seeking.platform : user.seeking.platform),
                                    'game' : ((typeof req.body.seeking.game == 'string' && (req.body.seeking.game.length > 0) ) ? req.body.seeking.game : user.seeking.game),
                                    'message' : ((typeof req.body.seeking.message == 'string' && (req.body.seeking.message.length > 0) ) ? req.body.seeking.message : user.seeking.message)
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
                        } else {
                            res.json({ 'success' : false, 'message' : 'Unauthorized' });
                        }
                    } else {
                        res.json({ 'success' : false, 'message' : 'User Not Found' });
                    }
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
                    if(req.user.user_name == user.user_name) {
                        res.json({ 'success' : true, 'message' : 'User deleted' });
                    } else {
                        res.json({ 'success' : false, 'message' : 'Unauthorized' });
                    }
                }
            });
        });
    return router;
}
