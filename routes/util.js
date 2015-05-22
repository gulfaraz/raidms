module.exports = function (util, express, User, auth) {
    var router = express.Router();
    router.get('/check/:query', function (req, res) {
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
                        if(user && user.status && user.status == 'registered') {
                            user.status = 'active';
                            user.role = 'member';
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
    router.get('/api/forgot/:query', function (req, res) {
        var query = { 'user_name' : req.params.query };
        if(util.validateEmail(req.params.query)) {
            query = { 'mail' : req.params.query };
        }
        User.find(query).limit(1).exec(function (err, user) {
            user = user[0];
            if(err) {
                res.json({ 'success' : false, 'message' : err.toString() });
            } else {
                if(user) {
                    var reset_token = auth.jwt.sign(user.user_name, auth.jwt_secret, {
                        expiresInMinutes: (60 * 2)
                    });
                    util.sendForgotPasscodeMail(user.mail, reset_token);
                    res.json({ 'success' : true, 'message' : 'Reset link sent to registered mail' });
                }
            }
        });
    });
    router.post('/api/reset', function (req, res) {
        auth.jwt.verify(req.body.token, auth.jwt_secret, function (err, decoded) {
            if(err || !decoded) {
                res.json({ 'success' : false, 'message' : 'Invalid Token' });
            } else {
                var query = { 'user_name' : decoded };
                User.find(query).limit(1).exec(function (err, user) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        user = user[0];
                        user.user_name = decoded;
                        user.password = req.body.password;
                        user.save(function (err) {
                            if(err) {
                                res.json({ 'success' : false, 'message' : err.toString() });
                            } else {
                                res.json({ 'success' : true, 'message' : 'Passcode Updated' });
                            }
                        });
                    }
                });
            }
        });
    });
    return router;
}
