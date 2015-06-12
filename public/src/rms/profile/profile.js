angular.module('rmsApp.profile', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('register', {
                'url' : '/register',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : 'src/rms/profile/register/register.html',
                'controller' : 'signUpController'
            })
            .state('user', {
                'url' : '/user/:user_name',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : 'src/rms/profile/view/user.html',
                'controller' : 'userController'
            })
            .state('editUser', {
                'url' : '/user/edit/:user_name',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : 'src/rms/profile/edit/userEdit.html',
                'controller' : 'userEditController'
            })
            .state('forgot', {
                'url' : '/forgot',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : 'src/rms/profile/recover/forgot/forgot.html',
                'controller' : 'forgotController'
            })
            .state('reset', {
                'url' : '/reset/:reset_token',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : 'src/rms/profile/recover/reset/reset.html',
                'controller' : 'resetController'
            });
    }]);
