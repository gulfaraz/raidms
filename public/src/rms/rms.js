angular.module("rmsApp", ["rmsApp.shared", "rmsApp.profile", "rmsApp.lfg", "rmsApp.lfm"])
    .config(["$urlRouterProvider", function ($urlRouterProvider) {
        $urlRouterProvider.otherwise("/lfg");
    }])
    .constant("rmsConstants", {
        "time_format" : "h:mm A",
        "date_format" : "(Do MMM)"
    }).constant("angularMomentConfig", {
        "timezone" : jstz.determine().name(),
        "statefulFilters" : true
    })
    .controller("sessionController",
        ["$scope", "api", "$state", "$localStorage", "$sce", "BroadcastMessage", "SessionControl", "amMoment", "angularMomentConfig", "util",
        function ($scope, api, $state, $localStorage, $sce, BroadcastMessage, SessionControl, amMoment, angularMomentConfig, util) {

        $scope.session_user_name = SessionControl.get_user_name;

        $scope.is_authenticated_user = SessionControl.is_authenticated_user;

        $scope.broadcast_message_service = BroadcastMessage;

        $scope.change_timezone = function (timezone) {
            amMoment.changeTimezone(timezone.name);
        };

        $scope.$on("amMoment:timezoneChanged", function () {
            $scope.timezone = util.timezone_lookup[angularMomentConfig.timezone];
        });

        $scope.timezones = util.get_timezones();

        $scope.timezone = util.timezone_lookup[jstz.determine().name()];

        api.get(function (data) {
            if(data.success) {
                $scope.server_status = data.status;
            }
        });

        api.get({ "set" : "user" },
            function (users) {
                if(users.success) {
                    $scope.online_users = users.data.length;
                }
            });

        $scope.sign_in = function () {
            BroadcastMessage.broadcast_message = "Signing In...";
            api.save({ "set" : "login" },
                {
                    "user_name" : $scope.user_name,
                    "password" : $scope.passcode
                },
                function (data) {
                    if(data.success) {
                        $localStorage.rms = data.token;
                        SessionControl.set_user(data.user_id);
                        BroadcastMessage.broadcast_message = null;
                        $scope.show_login_passcode = false;
                    } else {
                        $scope.sign_out();
                        BroadcastMessage.broadcast_message = data.message;
                    }
                });
        };

        $scope.sign_out = function () {
            api.get({ "set" : "logout" }, function (data) {
                if(data.success) {
                    $localStorage.$reset();
                    SessionControl.clear_session();
                }
            });
        };

        if($localStorage.rms) {
            api.save({ "set" : "login", "id" : $localStorage.rms },
                {},
                function (data) {
                    if(data.success) {
                        $localStorage.rms = data.token;
                        SessionControl.set_user(data.user_id);
                    } else {
                        $scope.sign_out();
                    }
                });
        }

        $scope.trustAsHtml = function (message) {
            return $sce.trustAsHtml(message);
        };

    }]);
