module.exports = function (util, router, Raid, auth) {
    router.route('/api/raid')
        .post(auth.isAuthenticated, function (req, res) {
            var raid = new Raid();
            raid.platform = req.body.platform;
            raid.game = req.body.game;
            raid.strength = req.body.strength;
            raid.players = req.body.players;
            raid.time_created = req.body.time_created;
            raid.play_time = req.body.play_time;
            raid.status = req.body.status;
            raid.host = req.user._id;
            raid.description = req.body.description;
            raid.save(function (err) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'message' : 'Raid created' });
                }
            });
        })
        .get(function (req, res) {
            var tableState = eval('(' + req.query.tableState + ')');
            if(!tableState) {
                tableState = {
                    "sort" : {
                        "predicate" : "time_created",
                        "reverse" : true
                    },
                    "search" : {
                        "predicateObject" : {}
                    },
                    "pagination" : {
                        "start" : 0,
                        "number" : 10
                    }
                };
            }
            var sort = ((tableState.sort.reverse ? '-' : '') + tableState.sort.predicate);
            var start = parseInt(req.query.start) || 0;
            var number = parseInt(req.query.number) || 10;
            var select = tableState.search.predicateObject || {};
            var found = (select.hasOwnProperty("$") ? ('(' + select['$'].split(' ').join('|') + ')') : '');
            select = util.except(select, ['$']);
            Raid
                .find({
                    '$and' : [
                        { '$and' : [select] },
                        { '$or' : [
                                { 'platform' : new RegExp(found, "ig") },
                                { 'game' : new RegExp(found, "ig") },
                                { 'status' : new RegExp(found, "ig") },
                                { 'description' : new RegExp(found, "ig") }
                            ]
                        }
                    ]
                })
                .sort(sort)
                .exec(function (err, raid) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        res.json({ 'success' : true, 'data' : raid.slice(start, start + number), 'numberOfPages' : Math.ceil(raid.length/number) });
                    }
                });
        });
    router.route('/api/raid/:raid_id')
        .get(function (req, res) {
            Raid.findById(req.params.raid_id, function (err, raid) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'data' : raid });
                }
            });
        })
        .post(auth.isAuthenticated, function (req, res) {
            Raid.find({ '_id' : req.params.raid_id }).limit(1).exec(function (err, raid) {
                raid = raid[0];
                if(raid.host.toString() == req.user._id.toString()) {
                    if(err) {
                        res.json({ 'success' : false, 'message' : err.toString() });
                    } else {
                        raid.platform = req.body.platform;
                        raid.game = req.body.game;
                        raid.strength = req.body.strength;
                        raid.players = req.body.players;
                        raid.play_time = req.body.play_time;
                        raid.status = req.body.status;
                        raid.description = req.body.description;
                        raid.save(function (err) {
                            if(err) {
                                res.json({ 'success' : false, 'message' : err.toString() });
                            } else {
                                res.json({ 'success' : true, 'message' : 'Raid updated' });
                            }
                        });
                    }
                } else {
                    res.json({ 'success' : false, 'message' : 'You can only edit raids that you have created' });
                }
            });
        })
        .delete(auth.isAuthenticated, function (req, res) {
            Raid.remove({
                '_id' : req.params.raid_id,
                'host' : req.user._id
            }, function (err, raid) {
                if(err) {
                    res.json({ 'success' : false, 'message' : err.toString() });
                } else {
                    res.json({ 'success' : true, 'message' : 'Raid deleted' });
                }
        });
    });;
    return router;
}
