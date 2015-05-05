angular.module('MainCtrl')
    .config(['$stateProvider', '$httpProvider', function($stateProvider, $httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
        $stateProvider
            .state('list', {
                url : '/list',
                params : {
                    'filterState' : {
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
                    'filterState' : {
                        'status' : '',
                        'platform' : '',
                        'game' : ''
                    }
                },
                templateUrl : 'views/raid.html',
                controller: 'raidController'
            })
            .state('register', {
                url : '/register',
                params : {},
                templateUrl : 'views/register.html'
            });
    }]);
