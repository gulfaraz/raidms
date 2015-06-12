angular.module('rmsApp.profile')
    .controller('forgotController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$parent.message = $stateParams.message;
        $scope.models = {};
        $scope.recover_account = function () {
            api.cache({ 'set' : 'forgot', 'id' : $scope.models.recover_account_form.lost.$viewValue }, function (data) {
                if(data.success) {
                    $state.go('list', { 'message' : data.message });
                } else {
                    $state.go('forgot', { 'message' : 'Recovery Failed' });
                }
            });
        };
    }]);
