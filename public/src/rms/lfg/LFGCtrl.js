angular.module("rmsApp.lfg", ["smart-table", "ui.router", "rmsApp.raid"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("lfg", {
                "url" : "/lfg",
                "templateUrl" : "/html/lfg.html",
                "controller" : "lfgController"
            });
    }])
    .controller("lfgController",
        ["$scope", "api", "$stateParams", "$state", "BroadcastMessage", "SessionControl", "rmsConstants", "util",
        function ($scope, api, $stateParams, $state, BroadcastMessage, SessionControl, rmsConstants, util) {

        $scope.session_user_id = SessionControl.get_user_id;

        $scope.filter = SessionControl.get_filters();

        $scope.set_filter = SessionControl.set_filter;

        $scope.rms_constants = rmsConstants;

        $scope.get_filter_list = util.get_filter_list;

        var raid_lookup = {};

        $scope.get_raids = function get_raids(tableState) {
            tableState.search.predicateObject = tableState.search.predicateObject || $scope.filter;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            api.get({ "set" : "raid", "start" : start, "number" : number, "tableState" : tableState },
                function (raids) {
                    if(raids.success) {
                        $scope.raids = raids.data;
                        tableState.pagination.numberOfPages = raids.numberOfPages;
                        $scope.show_raids = [].concat($scope.raids);
                        $scope.isLoading = false;
                        raid_lookup = {};
                        for (var i = 0, max = $scope.raids.length; i < max; i++) {
                            raid_lookup[$scope.raids[i]._id] = $scope.raids[i];
                        }
                    }
                });
        };

        $scope.join_raid = function (raid_id) {
            var raid = raid_lookup[raid_id];
            if(SessionControl.is_authenticated_user()) {
                api.save({ "set" : "raid", "id" : raid_id },
                    { "action" : "join" },
                    function (data) {
                        BroadcastMessage.broadcast_message = data.message;
                        if(data.success) {
                            if(raid.access === "open") {
                                raid.players.push($scope.session_user_id());
                            } else if(raid.access === "closed") {
                                raid.queue.push($scope.session_user_id());
                            }
                        }
                    });
            } else {
                $state.go("register");
            }
        };

        $scope.leave_raid = function (raid_id) {
            var raid = raid_lookup[raid_id];
            api.save({ "set" : "raid", "id" : raid_id },
                { "action" : "leave" },
                function (data) {
                    BroadcastMessage.broadcast_message = data.message;
                    if(data.success) {
                        raid.players.splice(raid.players.indexOf($scope.session_user_id()), 1);
                    }
                });
        };

    }]);
