angular.module('MainCtrl')
    .controller('signUpController', ['$scope', 'api', '$state', '$stateParams', function ($scope, api, $state, $stateParams) {
        $scope.showMessages = function (field) {
            return ($scope.signUp[field].$touched && $scope.signUp.$invalid);
        };
        $scope.sign_up = function () {
            api.save({ 'set' : 'user' } , { 'user_name' : $scope.register_user_name, 'password' : $scope.register_passcode, 'mail' : $scope.mail, 'timezone' : $scope.active_timezone }, function (data) {
                if(data.success) {
                    $state.go('list');
                    $scope.$parent.$parent.message = 'Please check your registered mail to complete the registration';
                    $scope.show_register_passcode = false;
                } else {
                    $state.go('register');
                    $scope.$parent.$parent.message = 'Registration Failed';
                }
            });
        };
    }]);