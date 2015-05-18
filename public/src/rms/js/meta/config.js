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
                templateUrl : 'views/list.html'
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
                templateUrl : 'views/raid.html'
            })
            .state('register', {
                url : '/register',
                params : {},
                templateUrl : 'views/register.html'
            })
            .state('user', {
                url : '/user/:user_name',
                params : {},
                templateUrl : 'views/user.html'
            })
            .state('editUser', {
                url : '/user/edit/:user_name',
                params : {},
                templateUrl : 'views/userEdit.html'
            });
    }]);
