angular.module('MainCtrl')
    .controller('resetController', ['$scope', 'api', '$state', '$stateParams', function ($scope, api, $state, $stateParams) {
        $scope.reset_passcode = function () {
            api.save({ 'set' : 'reset' } , { 'token' : $stateParams.reset_token, 'password' : $scope.passcode }, function (data) {
                if(data.success) {
                    $state.go('list');
                    $scope.$parent.$parent.message = 'Passcode Updated';
                    $scope.show_reset_passcode = false;
                } else {
                    $state.go('reset', { 'reset_token' : $stateParams.reset_token });
                    $scope.$parent.$parent.message = 'Registration Failed';
                }
            });
        };
    }]);
