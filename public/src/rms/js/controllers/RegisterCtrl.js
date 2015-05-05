angular.module('MainCtrl')
    .controller('signUpController', ['$scope', 'api', '$state', '$stateParams', function ($scope, api, $state, $stateParams) {
        $scope.username = 'testicular';
        $scope.passcode = 'cancer';
        $scope.mail = 'yoyo@yoyo.com';
        $scope.passcode_type = function () {
            return $scope.show_passcode ? 'text' : 'password';
        };
        $scope.showMessages = function (field) {
            return ($scope.signUp[field].$touched && $scope.signUp.$invalid);
        };
        $scope.sign_up = function () {
            api.save({ 'set' : 'user'} , { 'username' : $scope.username, 'password' : $scope.passcode, 'mail' : $scope.mail }, function (data) {
                if(data.success) {
                    $state.go('list');
                    $scope.$parent.$parent.message = 'Please check your registered mailbox to complete the registration.';
                } else {
                    $state.go('register');
                    $scope.$parent.$parent.message = 'Registration Failed.';
                }
            });
        };
    }]);
