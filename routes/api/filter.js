module.exports = function (router, Filter, auth) {
    router.route("/")
        .get(function (req, res) {
            Filter.find().exec(function (err, filter) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                }
                res.json({ "success" : true, "data" : filter });
            });
        });
    router.route("/:filter_type")
        .post(auth.passport.authenticate("bearer"), function (req, res) {
            if(req.authInfo.scope === "manage") {
                var filter_type = req.params.filter_type;
                var operand = {};
                operand[filter_type] = req.body[filter_type];
                var operation_object = {};
                operation_object[(req.body.remove) ? "$pull" : "$push"] = operand;
                Filter.update({}, operation_object, { "upsert" : true }, function (err, data) {
                    if(err) {
                        res.json({ "success" : false, "message" : err.toString() });
                    } else {
                        res.json({ "success" : true , "message" : ((req.body.remove) ? "" : "New ") + "Filter " + req.body[filter_type] + " of type " + filter_type.toUpperCase() + " " + ((req.body.remove) ? "removed" : "added") });
                    }
                });
            } else {
                res.json({ "success" : false, "message" : "Unauthorized" });
            }
        })
        .get(function (req, res) {
            var filter_type = req.params.filter_type;
            Filter.find().select(filter_type).exec(function (err, filter) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true, "data" : filter });
                }
            });
        });
    return router;
}
