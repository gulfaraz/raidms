angular.module("rmsApp.admin", ["ui.router"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("admin", {
                "url" : "/admin",
                "templateUrl" : "/html/admin.html",
                "controller" : "adminController"
            });
    }])
    .controller("adminController", [
        "$scope", "api", "util", "BroadcastMessage", "SessionControl",
        function ($scope, api, util, BroadcastMessage, SessionControl) {

        $scope.get_filter_list = util.get_filter_list;

        $scope.is_admin = SessionControl.is_admin;

        $scope.manage_users_message = "Loading...";

        api.get({ "set" : "user" },
            function (users) {
                if(users.success) {
                    $scope.users = users.data;
                    if($scope.users.length === 0) {
                        $scope.manage_users_message = "No Users";
                    } else {
                        $scope.manage_users_message = "";
                    }
                } else {
                    $scope.manage_users_message = "Could not get list of users";
                }
            });

        $scope.add_filter = function (type) {
            var filter_value = $scope.filter["new_" + type];
            var filter_values = { "remove" : false };
            filter_values[type] = filter_value;
            api.save({ "set" : "filter", "id" : type },
                filter_values,
                function (response) {
                    if(response.success) {
                        util.update_filter_list();
                        $scope.filter["new_" + type] = "";
                    }
                    BroadcastMessage.broadcast_message = response.message;
                });
        };

        $scope.remove_filter = function (type) {
            var filter_value = $scope.filter[type];
            var filter_values = { "remove" : true };
            filter_values[type] = filter_value;
            api.save({ "set" : "filter", "id" : type },
                filter_values,
                function (response) {
                    if(response.success) {
                        util.update_filter_list();
                        $scope.filter[type] = "";
                    }
                    BroadcastMessage.broadcast_message = response.message;
                });
        };

    }]);
