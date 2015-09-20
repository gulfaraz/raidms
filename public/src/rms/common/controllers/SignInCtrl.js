angular.module("rmsApp.shared")
    .controller("signInController",
        ["$stateParams", "$state", "$localStorage", "SessionControl",
        function ($stateParams, $state, $localStorage, SessionControl) {
            $localStorage.rms = $stateParams.token;
            SessionControl.set_user($stateParams.user_id);
            $state.go("user", { "user_name" : $stateParams.user_id });
    }]);
