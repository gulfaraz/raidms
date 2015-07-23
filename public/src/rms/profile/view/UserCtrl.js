angular.module('rmsApp.profile')
    .controller('userController', ['$scope', 'api', '$stateParams', '$state', '$timeout', function ($scope, api, $stateParams, $state, $timeout) {
        $scope.$parent.message = $stateParams.message;
        api.get({ 'set' : 'user', 'id' : $stateParams.user_name }, function (user) {
            if(user.success) {
                $scope.profile = $scope.localize([user.data])[0];
                set_play_start_pivot();
                set_play_end_pivot();
                configure_play_time_pivots();
                if(typeof $scope.profile.delete != 'undefined' && moment().diff($scope.profile.delete) > 0) {
                    $state.go('list');
                }
            } else {
                $state.go('list', { 'message' : user.message });
            }
        });
        $scope.$watch('active_timezone', function () {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function () {
            if($scope.profile) {
                $scope.profile = $scope.localize([$scope.profile])[0];
            }
        };
        var set_play_start_pivot = function () {
            $scope.play_start_pivot = ($scope.profile.play_start.isBefore() ? 'late' : ($scope.profile.play_start.isAfter() ? 'early' : ''));
        };
        var set_play_end_pivot = function () {
            $scope.play_end_pivot = ($scope.profile.play_end.isBefore() ? 'late' : ($scope.profile.play_end.isAfter() ? 'early' : ''));
        };
        var configure_play_time_pivots = function () {
            if(moment().diff($scope.profile.play_start) < 0) {
                $timeout(set_play_start_pivot, Math.abs(moment().diff($scope.profile.play_start)) + 1);
            }
            if(moment().diff($scope.profile.play_end) < 0) {
                $timeout(set_play_end_pivot, Math.abs(moment().diff($scope.profile.play_end)) + 1);
            }
            check_user_play_time();
            if(moment().isBefore($scope.profile.play_start)) {
                $timeout(check_user_play_time, Math.abs(moment().diff($scope.profile.play_start)) + 1);
            }
            if(moment().isBefore($scope.profile.play_end)) {
                $timeout(check_user_play_time, Math.abs(moment().diff($scope.profile.play_end)) + 1);
            }
        };
        var check_user_play_time = function () {
            if($scope.profile.play_start.isBefore($scope.profile.play_end)) {
                $scope.user_play_time = false;
                if(moment().isAfter($scope.profile.play_start) && moment().isBefore($scope.profile.play_end)) {
                    $scope.user_play_time = true;
                }
            } else {
                $scope.user_play_time = true;
                if(moment().isBefore($scope.profile.play_start) && moment().isAfter($scope.profile.play_end)) {
                    $scope.user_play_time = false;
                }
            }
        };
    }]);
