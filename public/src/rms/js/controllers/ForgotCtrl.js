angular.module('MainCtrl')
    .controller('forgotController', ['$scope', 'api', '$state', function ($scope, api, $state) {
        $scope.models = {};
        $scope.recover_account = function () {
            api.get({ 'set' : 'forgot', 'id' : $scope.models.recover_account_form.lost.$viewValue }, function (data) {
                if(data.success) {
                    $state.go('list');
                    $scope.$parent.$parent.message = data.message;
                } else {
                    $state.go('forgot');
                    $scope.$parent.$parent.message = 'Recovery Failed';
                }
            });
        };
    }]);
