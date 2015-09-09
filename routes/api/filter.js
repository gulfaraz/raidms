module.exports = function (router, Filter) {
    router.route("/")
        .post(function (req, res) {
            var filter = new Filter();
            filter.game = req.body.game;
            filter.platform = req.body.platform;
            filter.access = req.body.access;
            filter.save(function (err) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true, "message" : "Filters created" });
                }
            });
        })
        .get(function (req, res) {
            Filter.find().exec(function (err, filter) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                }
                res.json({ "success" : true, "data" : filter });
            });
        })
        .delete(function (req, res) {
            Filter.remove({}, function (err, user) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true , "message" : "Filters deleted" });
                }
            });
        });
    router.route("/:filter_type")
        .post(function (req, res) {
            var filter_type = req.params.filter_type;
            var push = {};
            push[filter_type] = req.body[filter_type];

            Filter.update({}, { "$push" : push }, { "upsert" : true }, function (err, data) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true , "message" : "New Filter " + req.body[filter_type] + " of type " + filter_type + " added" });
                }
            });
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
        })
        .delete(function (req, res) {
            var filter_type = req.params.filter_type;
            var pull = {};
            pull[filter_type] = req.body[filter_type];

            Filter.update({}, { "$pull" : pull }, { "upsert" : true }, function (err, data) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true , "message" : "Filter " + req.body[filter_type] + " of type " + filter_type + " removed" });
                }
            });
        });
    return router;
}
