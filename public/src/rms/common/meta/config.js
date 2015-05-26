angular.module('rmsApp.shared')
    .config(['$stateProvider', '$httpProvider', function($stateProvider, $httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
        $stateProvider
            .state('list', {
                url : '/list',
                params : {
                    'filter_state' : {}
                },
                templateUrl : 'src/rms/lfg/list.html'
            })
            .state('raid', {
                url : '/raid/:raid_id',
                params : {
                    'filter_state' : {}
                },
                templateUrl : 'src/rms/raid/view/raid.html'
            })
            .state('register', {
                url : '/register',
                params : {},
                templateUrl : 'src/rms/profile/register/register.html'
            })
            .state('user', {
                url : '/user/:user_name',
                params : {},
                templateUrl : 'src/rms/profile/view/user.html'
            })
            .state('editUser', {
                url : '/user/edit/:user_name',
                params : {},
                templateUrl : 'src/rms/profile/edit/userEdit.html'
            })
            .state('forgot', {
                url : '/forgot',
                params : {},
                templateUrl : 'src/rms/profile/recover/forgot/forgot.html'
            })
            .state('reset', {
                url : '/reset/:reset_token',
                params : {},
                templateUrl : 'src/rms/profile/recover/reset/reset.html'
            });
    }]);
