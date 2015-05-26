angular.module('rmsApp.profile')
    .controller('userController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        api.get({ 'set' : 'user', 'id' : $stateParams.user_name }, function (user) {
            if(user.success) {
                $scope.profile = $scope.localize([user.data])[0];
                if(typeof $scope.profile.delete != 'undefined' && moment().diff($scope.profile.delete) > 0) {
                    $state.go('list');
                }
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
    }]);
