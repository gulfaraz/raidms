module.exports = function (router, User, auth) {
    router.post("/", function (req, res) {
        User.find({ "user_name" : req.body.user_name })
            .limit(1)
            .exec(function (err, user) {
                if(err) {
                    res.json({
                        "success" : false,
                        "message" : err.toString()
                    });
                };
                user = user[0];
                if(!user) {
                    res.json({
                        "success" : false,
                        "message" : "Invalid User Name"
                    });
                } else if(user) {
                    user.verifyPassword(req.body.password, function (err, isMatch) {
                        if(err) {
                            res.json({
                                "success" : false,
                                "message" : err.toString()
                            });
                        }
                        if(!isMatch) {
                            res.json({
                                "success" : false,
                                "message" : "Invalid Passcode"
                            });
                        } else {
                            var token = auth.jwt.sign(user.user_name, auth.jwt_secret, {
                                expiresInMinutes: (60 * 24 * 14)
                            });
                            res.json({
                                "success" : true,
                                "message" : "User Authenticated",
                                "token" : token,
                                "user_name" : user.user_name,
                                "_id" : user._id
                            });
                        }
                    });
                }
            });
    });
    router.post("/:token", auth.isAuthenticated, function (req, res) {
        if(req.user) {
            res.json({
                "success": true,
                "message": "User Authenticated",
                "user_name" : req.user.user_name,
                "_id" : req.user._id
            });
        } else {
            res.json({
                "success": false,
                "message": "Invalid Token"
            });
        }
    });
    return router;
}
