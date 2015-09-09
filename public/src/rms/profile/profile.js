angular.module("rmsApp.profile", ["ui.router"])
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state("register", {
                "url" : "/register",
                "templateUrl" : "/html/register.html",
                "controller" : "signUpController"
            })
            .state("user", {
                "url" : "/user/:user_name",
                "templateUrl" : "/html/user.html",
                "controller" : "userController"
            })
            .state("editUser", {
                "url" : "/user/:user_name/edit",
                "templateUrl" : "/html/userEdit.html",
                "controller" : "userEditController"
            })
            .state("forgot", {
                "url" : "/forgot",
                "templateUrl" : "/html/forgot.html",
                "controller" : "forgotController"
            })
            .state("reset", {
                "url" : "/reset/:reset_token",
                "templateUrl" : "/html/reset.html",
                "controller" : "resetController"
            });
    }]);
