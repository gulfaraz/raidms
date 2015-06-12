angular.module('rmsApp.profile')
    .controller('resetController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$parent.message = $stateParams.message;
        $scope.reset_passcode = function () {
            api.save({ 'set' : 'reset' } , { 'token' : $stateParams.reset_token, 'password' : $scope.passcode }, function (data) {
                if(data.success) {
                    $state.go('list', { 'message' : 'Passcode Updated' });
                    $scope.show_reset_passcode = false;
                } else {
                    $state.go('reset', { 'reset_token' : $stateParams.reset_token, 'message' : 'Registration Failed' });
                }
            });
        };
    }]);
