angular.module('MainCtrl')
    .config(['$stateProvider', '$httpProvider', function($stateProvider, $httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
        $stateProvider
            .state('list', {
                url : '/list',
                params : {
                    'filter_state' : {}
                },
                templateUrl : 'views/list.html'
            })
            .state('raid', {
                url : '/raid/:raid_id',
                params : {
                    'filter_state' : {}
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
            })
            .state('forgot', {
                url : '/forgot',
                params : {},
                templateUrl : 'views/forgot.html'
            })
            .state('reset', {
                url : '/reset/:reset_token',
                params : {},
                templateUrl : 'views/reset.html'
            });
    }]);
