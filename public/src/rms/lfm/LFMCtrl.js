angular.module("rmsApp.lfm", ["ui.router"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("lfm", {
                "url" : "/lfm",
                "templateUrl" : "/html/lfm.html",
                "controller" : "lfmController"
            });
    }])
    .controller("lfmController",
        ["$scope", "api", "$stateParams", "$state", "util",
        function ($scope, api, $stateParams, $state, util) {

        $scope.get_filter_list = util.get_filter_list;

        api.get({ "set" : "user" },
            function (users) {
                if(users.success) {
                    $scope.users = users.data.sort(function (a, b) {
                        var a_play_time = is_user_play_time(util.get_time_as_today(a.play_start), util.get_time_as_today(a.play_end));
                        var b_play_time = is_user_play_time(util.get_time_as_today(b.play_start), util.get_time_as_today(b.play_end));
                        return ((a_play_time && !b_play_time) ? -1 : ((!a_play_time && b_play_time) ? 1 : 0));
                    });
                }
            });

        var is_user_play_time = function (play_start, play_end) {
            var user_play_time;
            if(moment(play_start).diff(play_end) < 0) {
                user_play_time = false;
                if(!util.is_now_ahead(play_start) &&
                    util.is_now_ahead(play_end)) {
                    user_play_time = true;
                }
            } else {
                user_play_time = true;
                if(util.is_now_ahead(play_start) &&
                    !util.is_now_ahead(play_end)) {
                    user_play_time = false;
                }
            }
            return user_play_time;
        };

        $scope.get_button_color = function (platform) {
            var platform_button_colors = {
                "PS4" : "ps4_blue",
                "XBOX One" : "x1_green",
                "PS3" : "ps3_blue",
                "XBOX 360" : "x360_green",
                "Wii" : "wii_gray",
                "PC" : "red"
            };
            return platform_button_colors[platform] ? (platform_button_colors[platform] + "_button") : "";
        };

    }]);
