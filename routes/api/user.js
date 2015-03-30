module.exports = function(router, User) {
    router.route('/user')
        .post(function(req, res) {
            var user = new User();
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.save(function(err) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'User created' });
            });
        })
        .get(function(req, res) {
            User.find(function(err, users) {
                if(err) {
                    res.send(err);
                }
                res.json(users);
            });
        });
    router.route('/user/:user_id')
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
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.save(function(err) {
                    if(err) {
                        res.send(err);
                    }
                    res.json({ message: 'User updated' });
                });
            });
        });
    return router;
}
