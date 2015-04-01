module.exports = function(router, Raid) {
    router.route('/api/raid')
        .post(function(req, res) {
            var raid = new Raid();
            raid.platform = req.body.platform;
            raid.game = req.body.game;
            raid.strength = req.body.strength;
            raid.players = req.body.players;
            raid.time_created = req.body.time_created;
            raid.play_time = req.body.play_time;
            raid.status = req.body.status;
            raid.host = req.body.host;
            raid.save(function(err) {
                if(err) {
                    res.send(err);
                }
                res.json({ message: 'Raid created' });
            });
        })
        .get(function(req, res) {
            Raid.find(function(err, raid) {
                if(err) {
                    res.send(err);
                }
                res.json(raid);
            });
        });
    router.route('/api/raid/:raid_id')
        .get(function(req, res) {
            Raid.findById(req.params.raid_id, function(err, raid) {
                if(err) {
                    res.send(err);
                }
                res.json(raid);
            });
        })
        .put(function(req, res) {
            Raid.findById(req.params.raid_id, function(err, raid) {
                if(err) {
                    res.send(err);
                }
                raid.platform = req.body.platform;
                raid.game = req.body.game;
                raid.strength = req.body.strength;
                raid.players = req.body.players;
                raid.time_created = req.body.time_created;
                raid.play_time = req.body.play_time;
                raid.status = req.body.status;
                raid.host = req.body.host;
                raid.save(function(err) {
                    if(err) {
                        res.send(err);
                    }
                    res.json({ message: 'Raid updated' });
                });
            });
        })
        .delete(function(req, res) {
            Raid.remove({
                _id: req.params.raid_id
            }, function(err, raid) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Raid deleted' });
        });
    });;
    return router;
}
