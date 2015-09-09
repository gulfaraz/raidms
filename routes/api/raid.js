module.exports = function (util, router, Raid, auth) {
    router.route("/")
        .post(auth.isAuthenticated, function (req, res) {
            if(req.user.status === "active") {
                Raid.find({ "players" : req.user._id }).exec(function (err, exists) {
                    if(err) {
                        res.json({ "success" : false, "message" : err.toString() });
                    } else {
                        if(exists.length === 0) {
                            var raid = new Raid();
                            raid.platform = req.body.platform;
                            raid.game = req.body.game;
                            raid.strength = req.body.strength;
                            raid.players = [req.user._id];
                            raid.play_time = req.body.play_time;
                            raid.access = req.body.access;
                            raid.host = req.user._id;
                            raid.description = req.body.description;
                            raid.queue = [];
                            raid.time_created = Date.now();
                            raid.save(function (err) {
                                if(err) {
                                    res.json({ "success" : false, "message" : err.toString() });
                                } else {
                                    res.json({ "success" : true, "message" : "Raid Created", "raid_id" : raid._id });
                                }
                            });
                        } else {
                            res.json({ "success" : false, "message" : "You are already in a <a href='#/raid/'" + exists[0]._id + ">Raid</a>" });
                        }
                    }
                });
            } else {
                res.json({ "success" : false, "message" : "Unauthorized" });
            }
        })
        .get(function (req, res) {
            var tableState = eval("(" + req.query.tableState + ")");
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
            var sort = ((tableState.sort.reverse ? "-" : "") + tableState.sort.predicate);
            var start = parseInt(req.query.start) || 0;
            var number = parseInt(req.query.number) || 10;
            var select = tableState.search.predicateObject || {};
            var found = (select.hasOwnProperty("$") ? ("(" + select["$"].split(" ").filter(function (item) { return (item.length > 1); }).join("|") + ")") : "");
            select = util.except(select, ["$"]);
            for(var prop in select) {
                if(!select[prop]) {
                    select = util.except(select, [prop]);
                }
            }
            Raid.find({
                    "$and" : [
                        { "$and" : [select] },
                        { "$or" : [
                                { "platform" : new RegExp(found, "ig") },
                                { "game" : new RegExp(found, "ig") },
                                { "access" : new RegExp(found, "ig") },
                                { "description" : new RegExp(found, "ig") }
                            ]
                        }
                    ]
                })
                .sort(sort)
                .exec(function (err, raid) {
                    if(err) {
                        res.json({ "success" : false, "message" : err.toString() });
                    } else {
                        res.json({ "success" : true, "data" : raid.slice(start, start + number), "numberOfPages" : Math.ceil(raid.length/number) });
                    }
                });
        });
    router.route("/:raid_id")
        .get(function (req, res) {
            Raid.findById(req.params.raid_id, function (err, raid) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true, "data" : raid });
                }
            });
        })
        .post(auth.isAuthenticated, function (req, res) {
            Raid.find({ "_id" : req.params.raid_id }).limit(1).exec(function (err, raid) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    raid = raid[0];
                    if(raid.host.toString() === req.user._id.toString()) {
                        if(req.body.action === "admit") {
                            if(req.body.player) {
                                if(raid.queue.indexOf(req.body.player) >= 0 && raid.players.indexOf(req.body.player) < 0) {
                                    raid.players.push(req.body.player);
                                    raid.queue.splice(raid.queue.indexOf(req.body.player), 1);
                                    raid.save(function (err) {
                                        if(err) {
                                            res.json({ "success" : false, "message" : err.toString() });
                                        } else {
                                            res.json({ "success" : true, "message" : "Player Added" });
                                        }
                                    });
                                } else {
                                    res.json({ "success" : false, "message" : "Invalid Request" });
                                }
                            } else {
                                res.json({ "success" : false, "message" : "Invalid User" });
                            }
                        } else if(req.body.action === "expel") {
                            if(req.body.player) {
                                if(raid.players.indexOf(req.body.player) >= 0) {
                                    raid.players.splice(raid.players.indexOf(req.body.player), 1);
                                    raid.save(function (err) {
                                        if(err) {
                                            res.json({ "success" : false, "message" : err.toString() });
                                        } else {
                                            res.json({ "success" : true, "message" : "Player Removed" });
                                        }
                                    });
                                } else {
                                    res.json({ "success" : false, "message" : "Invalid Request" });
                                }
                            } else {
                                res.json({ "success" : false, "message" : "Invalid User" });
                            }
                        } else {
                            raid.platform = req.body.platform;
                            raid.game = req.body.game;
                            raid.strength = req.body.strength;
                            raid.players = (req.body.players.length > 0) ? req.body.players : raid.players;
                            raid.access = req.body.access;
                            raid.description = req.body.description;
                            raid.save(function (err) {
                                if(err) {
                                    res.json({ "success" : false, "message" : err.toString() });
                                } else {
                                    res.json({ "success" : true, "message" : "Raid Updated" });
                                }
                            });
                        }
                    } else {
                        if(req.body.action === "join") {
                            Raid.find({ "players" : req.user._id }).exec(function (err, exists) {
                                if(err) {
                                    res.json({ "success" : false, "message" : err.toString() });
                                } else {
                                    if(exists.length === 0) {
                                        var success_message = "Raid Updated";
                                        if(raid.players.indexOf(req.user._id) >= 0) {
                                            res.json({ "success" : false, "message" : "Already Joined" });
                                        } else if(raid.queue.indexOf(req.user._id) >= 0) {
                                            res.json({ "success" : false, "message" : "Request Pending" });
                                        } else {
                                            if(raid.access === "open") {
                                                raid.players.push(req.user._id);
                                                success_message = "Joined Raid";
                                            } else {
                                                raid.queue.push(req.user._id);
                                                success_message = "Requested to Join";
                                            }
                                            raid.save(function (err) {
                                                if(err) {
                                                    res.json({ "success" : false, "message" : err.toString() });
                                                } else {
                                                    res.json({ "success" : true, "message" : success_message });
                                                }
                                            });
                                        }
                                    } else {
                                        res.json({ "success" : false, "message" : "You are already in a <a href='#/raid/'" + exists[0]._id + ">Raid</a>" });
                                    }
                                }
                            });
                        } else if(req.body.action === "leave") {
                            if(raid.players.indexOf(req.user._id) >= 0) {
                                raid.players.splice(raid.players.indexOf(req.user._id), 1);
                                raid.save(function (err) {
                                    if(err) {
                                        res.json({ "success" : false, "message" : err.toString() });
                                    } else {
                                        res.json({ "success" : true, "message" : "Abandoned Raid" });
                                    }
                                });
                            } else {
                                res.json({ "success" : false, "message" : "Not a Member" });
                            }
                        } else {
                            res.json({ "success" : false, "message" : "Access Denied" });
                        }
                    }
                }
            });
        })
        .delete(auth.isAuthenticated, function (req, res) {
            Raid.remove({
                "_id" : req.params.raid_id,
                "host" : req.user._id
            }, function (err, raid) {
                if(err) {
                    res.json({ "success" : false, "message" : err.toString() });
                } else {
                    res.json({ "success" : true, "message" : "Raid Deleted" });
                }
        });
    });;
    return router;
}
