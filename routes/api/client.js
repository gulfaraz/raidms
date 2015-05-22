module.exports = function (util, express, Client, auth) {
    var router = express.Router();
    router.route('/')
        .post(auth.isAuthenticated, function (req, res) {
            var client = new Client();
            client.name = req.body.name;
            client.id = req.body.id;
            client.secret = req.body.secret;
            client.user_id = req.user._id;
            client.save(function (err) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'message' : 'New Client Added', 'data' : client });
                }
            });
        })
        .get(auth.isAuthenticated, function (req, res) {
            Client.find({ 'user_id' : req.user._id }, function (err, clients) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'data' : clients });
                }
            });
        });
    return router;
}
