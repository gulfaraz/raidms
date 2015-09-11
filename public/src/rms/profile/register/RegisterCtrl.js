angular.module("rmsApp.profile")
    .controller("signUpController",
        ["$scope", "api", "$state", "BroadcastMessage", "angularMomentConfig", "SessionControl", "$localStorage",
        function ($scope, api, $state, BroadcastMessage, angularMomentConfig, SessionControl, $localStorage) {

        $scope.is_authenticated_user = SessionControl.is_authenticated_user;

        $scope.back_state = SessionControl.get_back_state();

        if($scope.is_authenticated_user()) {
            $state.go("lfg");
        }

        $scope.show_message = function (field) {
            return ($scope.signUp[field].$touched && $scope.signUp.$invalid);
        };

        $scope.sign_up = function () {
            api.save({ "set" : "user" },
                {
                    "user_name" : $scope.register_user_name,
                    "password" : $scope.register_passcode,
                    "mail" : $scope.mail,
                    "timezone" : angularMomentConfig.timezone
                },
                function (data) {
                    if(data.success) {
                        $localStorage.rms = data.token;
                        SessionControl.set_user(data.user_name, data._id);
                        BroadcastMessage.broadcast_message = "Please check your registered mail to complete the registration";
                        $scope.show_register_passcode = false;
                        $state.go("lfg");
                    } else {
                        BroadcastMessage.broadcast_message = "Registration Failed";
                        $state.go("register");
                    }
                });
        };

    }]);
