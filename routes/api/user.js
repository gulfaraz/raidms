module.exports = function (util, router, User, auth) {
    var select = 'username mail role status caption score play_start play_end platforms seeking date_joined date_updated';
    router.route('/api/user')
        .post(function (req, res) {
            var user = new User();
            user.username = req.body.username;
            user.password = req.body.password;
            user.mail = req.body.mail;
            user.role = req.body.role;
            user.status = req.body.status;
            user.caption = req.body.caption;
            user.score = req.body.score;
            user.play_start = req.body.play_start;
            user.play_end = req.body.play_end;
            user.platforms = req.body.platforms;
            user.seeking = req.body.seeking;
            user.date_joined = req.body.date_joined;
            user.date_updated = req.body.date_updated;
            user.save(function (err) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'message' : 'User created' });
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
            var query = { 'username' : req.params.user_id };
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
        .put(auth.isAuthenticated, function (req, res) {
            var query = { 'username' : req.params.user_id };
            if (req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
                query = { '_id' : req.params.user_id };
            }
            User.find(query).limit(1).exec(function (err, user) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    user.username = req.body.username;
                    user.password = req.body.password;
                    user.mail = req.body.mail;
                    user.role = req.body.role;
                    user.status = req.body.status;
                    user.caption = req.body.caption;
                    user.score = req.body.score;
                    user.play_start = req.body.play_start;
                    user.play_end = req.body.play_end;
                    user.platforms = req.body.platforms;
                    user.seeking = req.body.seeking;
                    user.date_joined = req.body.date_joined;
                    user.date_updated = req.body.date_updated;
                    user.save(function (err) {
                        if(err) {
                            res.json({ 'success' : false, 'message' : err.toString() });
                        } else {
                            res.json({ 'success' : true, 'message' : 'User updated' });
                        }
                    });
                }
            });
        })
        .delete(auth.isAuthenticated, function (req, res) {
            var query = { 'username' : req.params.user_id };
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
        User.findOne({
            'username' : req.body.username
        }, function (err, user) {
            if(err) {
                res.json({ 'success' : false, 'message' : err.toString() });
            };
            if(!user) {
                res.json({ 'success' : false, 'message' : 'Invalid username' });
            } else if(user) {
                user.verifyPassword(req.body.password, function (err, isMatch) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    }
                    if(!isMatch) {
                        res.json({ 'success' : false, 'message' : 'Invalid password' });
                    } else {
                        var token = auth.jwt.sign(user.username, auth.jwt_secret, {
                            expiresInMinutes: (60 * 24 * 14)
                        });
                        res.json({ 'success' : true, 'message' : 'User Authenticated', 'token' : token, 'username' : user.username });
                    }
                });
            }
        });
    });
    router.post('/api/login/:token', auth.isBearerAuthenticated,function (req, res) {
        if(req.user) {
            res.json({ 'success': true, 'message': 'User Authenticated', 'username' : req.user.username });
        } else {
            res.json({ 'success': false, 'message': 'Invalid Token' });
        }
    });

    router.get('/api/check/:query', function (req, res) {
        var query = { 'username' : req.params.query };
        if(util.validateEmail(req.params.query)) {
            query = { 'mail' : req.params.query };
        }
        User.find(query).exec(function (err, user) {
            if(err) {
                res.json({ 'success' : false, 'message' : err.toString() });
            } else {
                if(user.length > 0) {
                    res.json({ 'success' : true, 'available' : false, 'data' : user[0].username });
                } else {
                    res.json({ 'success' : true, 'available' : true });
                }
            }
        });
    });

    return router;
}
