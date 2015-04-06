module.exports = function(router, User) {
    router.route('/api/user')
        .post(function(req, res) {
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
            user.save(function(err) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'User created' });
            });
        })
        .get(function(req, res) {
            User.find(function(err, user) {
                if(err) {
                    res.send(err);
                }
                res.json(user);
            });
        });
    router.route('/api/user/:user_id')
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if(err) {
                    res.send(err);
                }
                res.json(user);
            });
        })
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if(err) {
                    res.send(err);
                }
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
                user.save(function(err) {
                    if(err) {
                        res.send(err);
                    }
                    res.json({ message: 'User updated' });
                });
            });
        })
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'User deleted' });
        });
    });;
    return router;
}
