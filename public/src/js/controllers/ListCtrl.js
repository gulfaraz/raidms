angular.module('MainCtrl')
    .controller('listController', ['$scope', 'api', function($scope, api) {
        $scope.message = "List";
    }]);
