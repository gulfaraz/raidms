angular.module("rmsApp.shared")
    .controller("messageController",
        ["$stateParams", "$state", "BroadcastMessage", "SessionControl",
        function ($stateParams, $state, BroadcastMessage, SessionControl) {
            BroadcastMessage.broadcast_message = $stateParams.message;
            $state.go("lfg");
    }]);
