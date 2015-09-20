module.exports = function (router, auth) {
    router.post("/", function (req, res, next) {
        auth.passport.authenticate("local", function (err, user, info) {
            if(err || !user) {
                res.json({ "success" : false, "message" : err.toString() });
            } else {
                req.logIn(user, function (err) {
                    if(err) {
                        res.json({ "success" : false, "message" : err.toString() });
                    } else {
                        res.json({
                            "success" : true,
                            "message" : "User Authenticated",
                            "token" : req.user.token,
                            "user_name" : req.user.user_name,
                            "user_id" : req.user.user_id
                        });
                    }
                });
            }
        })(req, res, next);
    });
    router.post("/:token", auth.passport.authenticate("bearer"), function (req, res) {
        if(req.user) {
            req.logIn(req.user, function (err) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({
                        "success": true,
                        "message": "User Authenticated",
                        "user_name" : req.user.user_name,
                        "user_id" : req.user.user_id,
                        "token" : req.user.token
                    });
                }
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
