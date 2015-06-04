module.exports = function (util, express, User, auth) {
    var router = express.Router();
    router.post('/', function (req, res) {
        User.find({
            'user_name' : req.body.user_name
        }).limit(1).exec(function (err, user) {
            user = user[0];
            if(err) {
                res.json({ 'success' : false, 'message' : err.toString() });
            };
            if(!user) {
                res.json({ 'success' : false, 'message' : 'Invalid User Name' });
            } else if(user) {
                user.verifyPassword(req.body.password, function (err, isMatch) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    }
                    if(!isMatch) {
                        res.json({ 'success' : false, 'message' : 'Invalid Passcode' });
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
    router.post('/:token', auth.isBearerAuthenticated, function (req, res) {
        if(req.user && req.user.status == 'active') {
            res.json({ 'success': true, 'message': 'User Authenticated', 'user_name' : req.user.user_name });
        } else {
            res.json({ 'success': false, 'message': 'Invalid Token' });
        }
    });
    return router;
}
