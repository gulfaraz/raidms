module.exports = function(router) {
    router.route('/')
        .get(function(req, res) {
            User.find(function(err, users) {
                if(err) {
                    res.send(err);
                }
                res.json(users);
            });
        });
    return router;
}
