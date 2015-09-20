angular.module("rmsApp.profile")
    .controller("userEditController",
        ["$scope", "api", "$stateParams", "$state", "$interval", "SessionControl", "util", "amMoment", "$timeout",
        function ($scope, api, $stateParams, $state, $interval, SessionControl, util, amMoment, $timeout) {

        $scope.session_user_name = SessionControl.get_user_name;

        $scope.back_state = SessionControl.get_back_state();

        $scope.models = {
            "passcode" : {
                "old_passcode" : null,
                "new_passcode" : null,
                "passcode_message" : null,
                "show_old_passcode" : false,
                "show_new_passcode" : false,
                "show_change_passcode" : false
            },
            "mail" : {
                "new_mail" : null,
                "mail_message" : null,
                "show_change_mail" : false
            },
            "delete" : {
                "old_delete" : null,
                "delete_message" : null,
                "show_old_delete" : false,
                "show_change_delete" : false,
                "countdown" : false
            },
            "message" : {
                "success" : false
            },
            "filter" : {
                "platform" : {},
                "game" : {}
            },
            "play_start" : moment(),
            "play_end" : moment(),
            "profile_details_changed" : true
        };

        $scope.timezones = util.get_timezones();

        $scope.get_filter_list = util.get_filter_list;

        api.get({ "set" : "user", "id" : $stateParams.user_name },
            function (user) {
                if(user.success) {
                    $scope.profile = user.data;
                    if(user.data.delete) {
                        if(!util.is_now_ahead($scope.profile.delete)) {
                            $state.go("lfg");
                        } else {
                            start_countdown($scope.profile.delete);
                        }
                    }
                    if($scope.profile.timezone) {
                        $scope.profile.timezone = util.timezone_lookup[$scope.profile.timezone];
                    } else {
                        $scope.profile.timezone = util.timezone_lookup[jstz.determine().name()];
                    }
                    $scope.models.play_start = $scope.profile.play_start;
                    $scope.models.play_end = $scope.profile.play_end;
                    $timeout(function () {
                        $scope.models.profile_details_changed = true;
                    }, 1);
                }
            });

        $scope.$watchGroup([
                "models.play_start",
                "models.play_end",
                "profile.timezone",
                "profile.seeking.platform",
                "profile.seeking.game",
                "profile.seeking.message",
                "profile.caption",
                "profile.platforms"
            ], function () {
                $scope.models.profile_form_status_message = null;
                $scope.models.profile_form_status_message_success = true;
                $scope.models.profile_details_changed = false;
            });

        $scope.toggle = function (section) {
            var toggle_state = $scope.models[section]["show_change_" + section];
            $scope.models.passcode.show_change_passcode =
            $scope.models.mail.show_change_mail =
            $scope.models.delete.show_change_delete = false;
            $scope.models[section]["show_change_" + section] = !toggle_state;
            $scope.models.passcode.passcode_message =
            $scope.models.mail.mail_message =
            $scope.models.delete.delete_message = null;
            $scope.models[section]["old_" + section] = $scope.models[section]["new_" + section] = null;
            if(section === "passcode" || section === "delete") {
                $scope.models[section]["show_old_" + section] =
                $scope.models[section]["show_new_" + section] = false;
            }
            $scope.models[section]["change_" + section + "_form"].$setPristine();
            $scope.models[section]["change_" + section + "_form"].$setUntouched();
        };

        $scope.set_credentials = function () {
            api.save({ "set" : "user", "id" : $scope.session_user_name() },
                {
                    "user_name" : $scope.models.credentials.user_name,
                    "password" : $scope.models.credentials.passcode
                },
                function (data_change) {
                    if(data_change.success) {
                        $scope.profile.user_name = $scope.models.credentials.user_name;
                        SessionControl.set_user(SessionControl.get_user_id());
                        $scope.models.credentials.user_name = null;
                        $scope.models.credentials.passcode = null;
                        $scope.models.credentials.credentials_message = null;
                    } else {
                        $scope.models.credentials.credentials_message = "Could Not Save";
                    }
                });
        };

        $scope.change_passcode = function () {
            $scope.models.message.success = false;
            if(($scope.models.passcode.old_passcode &&
                $scope.models.passcode.old_passcode.length > 0) &&
                ($scope.models.passcode.new_passcode && $scope.models.passcode.new_passcode.length > 0)) {
                if($scope.models.passcode.old_passcode === $scope.models.passcode.new_passcode) {
                    $scope.models.passcode.passcode_message = "Invalid Passcode";
                } else {
                    api.save({ "set" : "login" },
                        {
                            "user_name" : $scope.session_user_name(),
                            "password" : $scope.models.passcode.old_passcode
                        },
                        function (data_login) {
                            if(data_login.success) {
                                api.save({ "set" : "user", "id" : $scope.session_user_name() },
                                    {
                                        "user_name" : $scope.session_user_name(),
                                        "password" : $scope.models.passcode.new_passcode
                                    },
                                    function (data_change) {
                                        if(data_change.success) {
                                            $scope.models.passcode.passcode_message = "Passcode Changed";
                                            $scope.models.passcode.old_passcode =
                                            $scope.models.passcode.new_passcode = null;
                                            $scope.models.passcode.show_old_passcode =
                                            $scope.models.passcode.show_new_passcode =
                                            $scope.models.passcode.show_change_passcode = false;
                                            $scope.models.message.success = true;
                                        } else {
                                            $scope.models.passcode.passcode_message = "Passcode Change Failed";
                                        }
                                    });
                                $scope.models.passcode.passcode_message = null;
                            } else {
                                $scope.models.passcode.passcode_message = "Invalid Passcode";
                            }
                        });
                }
            } else {
                $scope.models.passcode.passcode_message = "Invalid Passcode";
            }
        };

        $scope.change_mail = function () {
            $scope.models.message.success = false;
            api.save({ "set" : "user", "id" : $scope.session_user_name() },
                {
                    "user_name" : $scope.session_user_name(),
                    "mail" : $scope.models.mail.new_mail
                },
                function (data_change) {
                    if(data_change.success) {
                        $scope.models.mail.mail_message = data_change.message;
                        $scope.models.mail.new_mail = null;
                        $scope.models.mail.show_change_mail = false;
                        $scope.models.message.success = true;
                    } else {
                        $scope.models.mail.mail_message = "Mail Change Failed";
                    }
                });
            $scope.models.mail.mail_message = null;
        };

        $scope.delete_account = function () {
            $scope.models.message.success = false;
            api.save({ "set" : "login" },
                {
                    "user_name" : $scope.session_user_name(),
                    "password" : $scope.models.delete.old_delete
                },
                function (data_login) {
                    if(data_login.success) {
                        api.save({ "set" : "user", "id" : $scope.session_user_name() },
                            {
                                "user_name" : $scope.session_user_name(),
                                "delete" : moment().add(1, "d").utc()
                            },
                            function (data_change) {
                                if(data_change.success) {
                                    $scope.models.delete.delete_message = data_change.message;
                                    $scope.models.delete.old_delete = null;
                                    $scope.models.delete.show_old_delete =
                                    $scope.models.delete.show_change_delete = false;
                                    start_countdown(moment().utc().add(1, "d"));
                                    $scope.models.message.success = true;
                                } else {
                                    $scope.models.delete.delete_message = "Action Failed. Please try again later.";
                                }
                            });
                        $scope.models.delete.delete_message = null;
                    } else {
                        $scope.models.delete.delete_message = "Invalid Passcode";
                    }
                });
        };

        $scope.cancel_termination = function () {
            $scope.models.message.success = false;
            api.save({ "set" : "user", "id" : $scope.session_user_name() },
                {
                    "user_name" : $scope.session_user_name(),
                    "delete" : null
                },
                function (data_change) {
                    if(data_change.success) {
                        $scope.models.delete.delete_message = "Account Termination Cancelled";
                        $scope.models.delete.old_delete = null;
                        $scope.models.delete.show_old_delete =
                        $scope.models.delete.show_change_delete =
                        $scope.models.delete.countdown = false;
                        $scope.models.message.success = true;
                        $scope.profile.delete = null;
                        if(angular.isDefined($scope.interval)) {
                            $interval.cancel($scope.interval);
                            $scope.interval = null;
                        }
                    } else {
                        $scope.models.delete.delete_message = "Action Failed. Please try again later.";
                    }
                });
        };

        $scope.add_platform = function (platform) {
            $scope.profile.platforms.push(platform);
        };

        $scope.remove_platform = function (value) {
            $scope.profile.platforms.splice($scope.profile.platforms.indexOf(value), 1);
        };

        var start_countdown = function (time) {
            $scope.profile.delete = moment(time);
            if(util.is_now_ahead($scope.profile.delete)) {
                $scope.interval = $interval(function() {
                    if(util.is_now_ahead($scope.profile.delete)) {
                        $scope.models.delete.countdown = moment(moment($scope.profile.delete).diff()).utc().format("HH:mm:ss");
                    } else {
                        $scope.models.delete.countdown = false;
                        if(angular.isDefined($scope.interval)) {
                            $interval.cancel($scope.interval);
                            $scope.interval = null;
                        }
                        $state.go("lfg");
                    }
                }, 900);
            }
        };

        $scope.update_profile = function () {
            var timezone = $scope.profile.timezone.name;
            var updated_profile = {
                "user_name" : $scope.session_user_name(),
                "caption" : $scope.profile.caption,
                "seeking" : $scope.profile.seeking,
                "platforms" : $scope.profile.platforms,
                "play_start" : moment.tz(timezone).set({
                    "hour" : moment($scope.models.play_start).format("HH"),
                    "minute" : moment($scope.models.play_start).format("mm")
                }).utc().format(),
                "play_end" : moment.tz(timezone).set({
                    "hour" : moment($scope.models.play_end).format("HH"),
                    "minute" : moment($scope.models.play_end).format("mm")
                }).utc().format(),
                "timezone" : timezone
            };
            api.save({ "set" : "user", "id" : $scope.session_user_name() },
                updated_profile,
                function (data_change) {
                    if(data_change.success) {
                        amMoment.changeTimezone(timezone);
                        $scope.models.profile_form_status_message = "Profile Updated";
                        $scope.models.profile_form_status_message_success = true;
                        $scope.models.profile_details_changed = true;
                    } else {
                        $scope.models.profile_form_status_message = "Update Error";
                        $scope.models.profile_form_status_message_success = false;
                    }
                });
        };

        $scope.unlink = function (account) {
            api.get({ "set" : "unlink", "id" : account },
                function (user) {
                    if(user.success) {
                        $scope.profile.social = user.social;
                    }
                });
        };

    }]);
