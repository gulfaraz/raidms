angular.module("rmsApp.raid", ["ui.router"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("raid", {
                "url" : "/raid/:raid_id",
                "templateUrl" : "/html/raid.html",
                "controller" : "raidController"
            })
            .state("editRaid", {
                "url" : "/raid/edit/:raid_id",
                "templateUrl" : "/html/raidEdit.html",
                "controller" : "raidEditController"
            });
    }]);
