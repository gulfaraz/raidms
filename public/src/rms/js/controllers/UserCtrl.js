angular.module('MainCtrl')
    .controller('userController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        api.get({ 'set' : 'user', 'id' : $stateParams.user_name }, function (user) {
            $scope.profile = $scope.localize(user.data)[0];
            if(moment().diff($scope.profile.delete) > 0) {
                $state.go('list');
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
