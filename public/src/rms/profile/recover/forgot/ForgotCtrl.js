angular.module("rmsApp.profile")
    .controller("forgotController",
        ["$scope", "api", "$state", "BroadcastMessage", "SessionControl",
        function ($scope, api, $state, BroadcastMessage, SessionControl) {

        $scope.is_authenticated_user = SessionControl.is_authenticated_user;

        if($scope.is_authenticated_user()) {
            $state.go("lfg");
        }

        $scope.recover_account = function () {
            api.cache({ "set" : "forgot", "id" : $scope.recover_account_form.lost.$viewValue },
                function (data) {
                    if(data.success) {
                        BroadcastMessage.broadcast_message = data.message;
                        $state.go("lfg");
                    } else {
                        BroadcastMessage.broadcast_message = "Recovery Failed";
                        $state.go("forgot");
                    }
                });
        };

    }]);
