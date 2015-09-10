angular.module("rmsApp.raid")
    .controller("raidEditController",
        ["$scope", "api", "$stateParams", "$state", "BroadcastMessage", "SessionControl", "util",
        function ($scope, api, $stateParams, $state, BroadcastMessage, SessionControl, util) {

        $scope.get_filter_list = util.get_filter_list;

        $scope.is_authenticated_user = SessionControl.is_authenticated_user;

        $scope.back_state = SessionControl.get_back_state();

        if(!$scope.is_authenticated_user()) {
            $state.go("register");
        }

        $scope.raid_times = {
            "hour" : ["0", "1", "2"],
            "minute" : ["05", "15", "30", "45"]
        };

        $scope.capacity = {
            "min" : 3,
            "max" : 12
        };

        $scope.raid = {
            "strength" : 6,
            "time" : {
                "hour" : $scope.raid_times.hour[0],
                "minute" : $scope.raid_times.minute[1]
            },
            "access" : "open"
        };

        if($stateParams.raid_id) {
            api.get({ "set" : "raid", "id" : $stateParams.raid_id },
                function (raid) {
                    if(raid.success) {
                        $scope.raid = raid.data;
                        $scope.player_data = {};
                        $scope.capacity.min = Math.max($scope.raid.players.length, 3);
                        angular.forEach($scope.raid.players, function (player) {
                            api.cache({ "set" : "user", "id" : player }, function (user) {
                                if(user.success) {
                                    $scope.player_data[player] = user.data;
                                    $scope.player_data[player].show = false;
                                }
                            });
                        });
                    }
                });
        } else if($scope.is_authenticated_user()) {
            api.get({ "set" : "user", "id" : SessionControl.get_user_name() },
                function (user) {
                    if(user.success) {
                        $scope.raid.platform = user.data.seeking.platform;
                        $scope.raid.game = user.data.seeking.game;
                        $scope.raid.description = user.data.seeking.message;
                    }
                });
        }

        $scope.create_update_raid = function () {
            var raid = angular.copy($scope.raid);
            raid.user_name = SessionControl.get_user_name();
            var raid_api_path = { "set" : "raid" };

            if($stateParams.raid_id) {
                raid_api_path.id = $stateParams.raid_id;
            } else {
                raid.play_time = moment.utc().add($scope.raid.time.hour, "hour").add($scope.raid.time.minute, "minute");
            }

            api.save(raid_api_path, raid, function (data) {
                if(data.success) {
                    $state.go("raid", {
                        "raid_id" : $stateParams.raid_id || data.raid_id,
                        "message" : data.message
                    });
                } else {
                    BroadcastMessage.broadcast_message = data.message;
                }
            });
        };

    }]);
