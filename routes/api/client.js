module.exports = function(router, Client, auth) {
    router.route('/api/client/')
        .post(auth.isAuthenticated, function(req, res) {
            var client = new Client();
            client.name = req.body.name;
            client.id = req.body.id;
            client.secret = req.body.secret;
            client.user_id = req.user._id;
            client.save(function(err) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'New Client Added', data: client });
            });
        })
        .get(auth.isAuthenticated, function(req, res) {
            Client.find({ userId: req.user._id }, function(err, clients) {
                if(err) {
                    res.send(err);
                }
                res.json(clients);
            });
        });
    return router;
}
