angular.module('rmsApp.profile', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('register', {
                'url' : '/register',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : '/html/register.html',
                'controller' : 'signUpController'
            })
            .state('user', {
                'url' : '/user/:user_name',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : '/html/user.html',
                'controller' : 'userController'
            })
            .state('editUser', {
                'url' : '/user/:user_name/edit',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : '/html/userEdit.html',
                'controller' : 'userEditController'
            })
            .state('forgot', {
                'url' : '/forgot',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : '/html/forgot.html',
                'controller' : 'forgotController'
            })
            .state('reset', {
                'url' : '/reset/:reset_token',
                'params' : {
                    'message' : ''
                },
                'templateUrl' : '/html/reset.html',
                'controller' : 'resetController'
            });
    }]);
