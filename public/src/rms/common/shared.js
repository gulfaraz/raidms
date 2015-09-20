angular.module("rmsApp.shared", ["ngResource", "ngStorage", "ngMessages", "angularMoment", "ui.router"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("signIn", {
                "url" : "/signIn/:user_id/:token",
                "template" : "<h1>Signing In...</h1>",
                "controller" : "signInController"
            })
            .state("message", {
                "url" : "/message/:message",
                "template" : "<h1>Loading...</h1>",
                "controller" : "messageController"
            });
    }]);
