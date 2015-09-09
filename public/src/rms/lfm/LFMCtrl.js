angular.module("rmsApp.lfm", ["ui.router"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("queue", {
                "url" : "/lfm",
                "templateUrl" : "/html/queue.html",
                "controller" : "queueController"
            });
    }])
    .controller("queueController",
        ["$scope", "api", "$stateParams", "$state",
        function ($scope, api, $stateParams, $state) {


    }]);
