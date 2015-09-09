angular.module("rmsApp.profile")
    .controller("resetController",
        ["$scope", "api", "$stateParams", "$state", "BroadcastMessage", "SessionControl",
        function ($scope, api, $stateParams, $state, BroadcastMessage, SessionControl) {

        $scope.is_authenticated_user = SessionControl.is_authenticated_user;

        if($scope.is_authenticated_user()) {
            $state.go("lfg");
        }

        $scope.reset_passcode = function () {
            api.save({ "set" : "reset" },
                {
                    "token" : $stateParams.reset_token,
                    "password" : $scope.passcode
                },
                function (data) {
                    if(data.success) {
                        BroadcastMessage.broadcast_message = "Passcode Updated";
                        $scope.show_reset_passcode = false;
                        $state.go("lfg");
                    } else {
                        BroadcastMessage.broadcast_message = "Registration Failed";
                        $state.go("reset", { "reset_token" : $stateParams.reset_token });
                    }
                });
        };

    }]);
