angular.module('rmsApp.lfm', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('queue', {
                'url' : '/lfm',
                'params' : {
                    'filter_state' : {},
                    'message' : ''
                },
                'templateUrl' : '/html/queue.html',
                'controller' : 'queueController'
            });
    }])
    .controller('queueController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$parent.message = $stateParams.message;
    }]);
