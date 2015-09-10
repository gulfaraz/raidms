angular.module("rmsApp.raid")
    .controller("raidController",
        ["$scope", "api", "$stateParams", "$state", "$timeout", "SessionControl", "rmsConstants", "util",
        function ($scope, api, $stateParams, $state, $timeout, SessionControl, rmsConstants, util) {

        $scope.session_user_id = SessionControl.get_user_id;

        $scope.set_filter = SessionControl.set_filter;

        $scope.rms_constants = rmsConstants;

        $scope.back_state = SessionControl.get_back_state();

        api.get({ "set" : "raid", "id" : $stateParams.raid_id },
            function (raid) {
                if(raid.success) {

                    $scope.raid = raid.data;

                    if(util.is_now_ahead($scope.raid.play_time)) {
                        $scope.play_time_passed = false;
                        $timeout(function () {
                            $scope.play_time_passed = true;
                        }, Math.abs(moment().diff($scope.raid.play_time)) + 1);
                    } else {
                        $scope.play_time_passed = true;
                    }

                    $scope.player_data = {};
                    $scope.queue_data = {};

                    angular.forEach($scope.raid.players, function (player) {
                        api.cache({ "set" : "user", "id" : player }, function (user) {
                            if(user.success) {
                                $scope.player_data[player] = user.data;
                                $scope.player_data[player].show = false;
                            }
                        });
                    });

                    angular.forEach($scope.raid.queue, function (requester) {
                        api.cache({ "set" : "user", "id" : requester }, function (user) {
                            if(user.success) {
                                $scope.queue_data[requester] = user.data;
                                $scope.queue_data[requester].show = false;
                            }
                        });
                    });

                }
            });

        $scope.join_raid = function () {
            if(SessionControl.is_authenticated_user()) {
                api.save({ "set" : "raid", "id" : $stateParams.raid_id },
                    { "action" : "join" },
                    function (raid) {
                        $scope.action_status = raid.message;
                        if(raid.success) {
                            if($scope.raid.access === "open") {
                                $scope.raid.players.push($scope.session_user_id());
                                api.cache({ "set" : "user", "id" : $scope.session_user_id() },
                                    function (user) {
                                        if(user.success) {
                                            $scope.player_data[$scope.session_user_id()] = user.data;
                                            $scope.player_data[$scope.session_user_id()].show = false;
                                        }
                                    }
                                );
                            } else if($scope.raid.access === "closed") {
                                $scope.raid.queue.push($scope.session_user_id());
                                api.cache({ "set" : "user", "id" : $scope.session_user_id() },
                                    function (user) {
                                        if(user.success) {
                                            $scope.queue_data[$scope.session_user_id()] = user.data;
                                            $scope.queue_data[$scope.session_user_id()].show = false;
                                        }
                                    }
                                );
                            }
                        }
                    });
            } else {
                $state.go("register");
            }
        };

        $scope.leave_raid = function () {
            api.save({ "set" : "raid", "id" : $stateParams.raid_id },
                { "action" : "leave" },
                function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        $scope.raid.players.splice($scope.raid.players.indexOf($scope.session_user_id()), 1);
                        $scope.player_data = util.all_but($scope.session_user_id(), $scope.player_data);
                    }
                });
        };

        $scope.approve_request = function (player) {
            api.save({ "set" : "raid", "id" : $stateParams.raid_id },
                { "action" : "admit", "player" : player },
                function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        $scope.raid.players.push(player);
                        $scope.raid.queue.splice($scope.raid.queue.indexOf(player), 1);
                        $scope.player_data[player] = $scope.queue_data[player];
                        $scope.queue_data = util.all_but(player, $scope.queue_data);
                    }
                });
        };

        $scope.expel_player = function (player) {
            api.save({ "set" : "raid", "id" : $stateParams.raid_id },
                { "action" : "expel", "player" : player },
                function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        $scope.raid.players.splice($scope.raid.players.indexOf(player), 1);
                        $scope.player_data = util.all_but(player, $scope.player_data);
                    }
                });
        };

    }]);
