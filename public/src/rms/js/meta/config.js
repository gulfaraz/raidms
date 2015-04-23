angular.module('MainCtrl')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('list', {
                url : '/list',
                params : {
                    filterState : {
                        'status' : '',
                        'platform' : '',
                        'game' : ''
                    }
                },
                templateUrl : 'views/list.html',
                controller : 'listController'
            })
            .state('raid', {
                url : '/raid/:raid_id',
                params : {
                    filterState : {
                        'status' : '',
                        'platform' : '',
                        'game' : ''
                    }
                },
                templateUrl : 'views/raid.html',
                controller: 'raidController'
            });
    }]);
