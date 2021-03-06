angular.module("rmsApp.profile")
    .controller("userController",
        ["$scope", "api", "$stateParams", "$state", "$timeout", "BroadcastMessage", "SessionControl", "rmsConstants", "util",
        function ($scope, api, $stateParams, $state, $timeout, BroadcastMessage, SessionControl, rmsConstants, util) {

        $scope.rms_constants = rmsConstants;

        $scope.session_user_name = SessionControl.get_user_name;

        $scope.set_filter = SessionControl.set_filter;

        $scope.is_now_ahead = util.is_now_ahead;

        $scope.back_state = SessionControl.get_back_state();

        if(!$stateParams.user_name) {
            BroadcastMessage.broadcast_message = "Invalid User";
            $state.go("lfg");
        }

        api.get({ "set" : "user", "id" : $stateParams.user_name },
            function (user) {
                if(user.success) {
                    $scope.profile = user.data;

                    if($scope.profile.delete && !$scope.is_now_ahead($scope.profile.delete)) {
                        BroadcastMessage.broadcast_message = "User Not Found";
                        $state.go("lfg");
                    }

                    $scope.profile.play_start = util.get_time_as_today($scope.profile.play_start);
                    $scope.profile.play_end = util.get_time_as_today($scope.profile.play_end);

                    check_user_play_time();

                    if($scope.is_now_ahead($scope.profile.play_start)) {
                        $timeout(check_user_play_time, Math.abs(moment().diff($scope.profile.play_start)) + 1);
                    }
                    if($scope.is_now_ahead($scope.profile.play_end)) {
                        $timeout(check_user_play_time, Math.abs(moment().diff($scope.profile.play_end)) + 1);
                    }
                } else {
                    BroadcastMessage.broadcast_message = user.message;
                    $state.go("lfg");
                }
            });

        var check_user_play_time = function () {
            if(moment($scope.profile.play_start).diff($scope.profile.play_end) < 0) {
                $scope.user_play_time = false;
                if(!$scope.is_now_ahead($scope.profile.play_start) &&
                    $scope.is_now_ahead($scope.profile.play_end)) {
                    $scope.user_play_time = true;
                }
            } else {
                $scope.user_play_time = true;
                if($scope.is_now_ahead($scope.profile.play_start) &&
                    !$scope.is_now_ahead($scope.profile.play_end)) {
                    $scope.user_play_time = false;
                }
            }
        };

    }]);
