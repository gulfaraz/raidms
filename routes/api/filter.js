module.exports = function(router, Filter) {
    router.route('/api/filter/')
        .post(function(req, res) {
            var filter = new Filter();
            filter.game = req.body.game;
            filter.platform = req.body.platform;
            filter.status = req.body.status;
            filter.save(function(err) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'Filters created' });
            });
        })
        .get(function(req, res) {
            Filter.find().exec(function(err, filter) {
                if(err) {
                    res.send(err);
                }
                res.json(filter);
            });
        })
        .delete(function(req, res) {
            Filter.remove({}, function(err, user) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Filters deleted' });
            });
        });
    router.route('/api/filter/:filter_type')
        .post(function(req, res) {
            var filter_type = req.params.filter_type;
            var push = {};
            push[filter_type] = req.body[filter_type];

            Filter.update({}, { $push: push }, { upsert : true }, function(err, data) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'New Filter ' + req.body[filter_type] + ' of type ' + filter_type + ' added' });
            });
        })
        .get(function(req, res) {
            var filter_type = req.params.filter_type;
            Filter.find().select(filter_type).exec(function(err, filter) {
                if(err) {
                    res.send(err);
                }
                res.json(filter);
            });
        })
        .delete(function(req, res) {
            var filter_type = req.params.filter_type;
            var pull = {};
            pull[filter_type] = req.body[filter_type];

            Filter.update({}, { $pull: pull }, { upsert : true }, function(err, data) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'Filter ' + req.body[filter_type] + ' of type ' + filter_type + ' removed' });
            });
        });
    return router;
}
