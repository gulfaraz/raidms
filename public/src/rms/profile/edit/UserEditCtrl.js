angular.module('rmsApp.profile')
    .controller('userEditController', ['$scope', 'api', '$stateParams', '$state', '$interval', function ($scope, api, $stateParams, $state, $interval) {
        $scope.models = {
            'passcode' : {
                'old_passcode' : '',
                'new_passcode' : '',
                'passcode_message' : '',
                'show_old_passcode' : false,
                'show_new_passcode' : false,
                'show_change_passcode' : false
            },
            'mail' : {
                'new_mail' : '',
                'mail_message' : '',
                'show_change_mail' : false
            },
            'delete' : {
                'old_delete' : '',
                'delete_message' : '',
                'show_old_delete' : false,
                'show_change_delete' : false,
                'countdown' : false
            },
            'filter' : {
                'platform' : {},
                'game' : {}
            }
        };
        api.retrieve({ 'set' : 'user', 'id' : $stateParams.user_name }, function (user) {
            $scope.profile = $scope.localize([user.data])[0];
            if(moment().diff($scope.profile.delete) > 0) {
                $state.go('list');
            } else {
                start_countdown($scope.profile.delete);
                refresh_new_platforms();
                $scope.models.play_start = $scope.profile.play_start;
                $scope.models.play_end = $scope.profile.play_end;
                if($scope.profile.timezone) {
                    $scope.profile.timezone = '(' + moment.tz($scope.profile.timezone).format('Z')+' GMT) ' + $scope.profile.timezone;
                } else {
                    $scope.profile.timezone = '(' + moment.tz(jstz.determine().name()).format('Z')+' GMT) ' + jstz.determine().name();
                }
            }
        });
        $scope.$watch('active_timezone', function () {
            $scope.update_to_active_timezone();
        });
        $scope.$watchGroup(['models.play_start', 'models.play_end', 'profile.timezone', 'profile.seeking.platform', 'profile.seeking.game', 'profile.seeking.message', 'profile.caption', 'profile.platforms'], function () {
            $scope.models.profile_form_status_message = '';
        });
        $scope.update_to_active_timezone = function () {
            if($scope.profile) {
                $scope.profile = $scope.localize([$scope.profile])[0];
            }
        };
        $scope.toggle = function (section) {
            $scope.models[section]['show_change_' + section] = !$scope.models[section]['show_change_' + section];
            $scope.models[section][section + '_message'] = $scope.models[section]['old_' + section] = $scope.models[section]['new_' + section] = '';
            if(section == 'passcode' || section == 'delete') {
                $scope.models[section]['show_old_' + section] = $scope.models[section]['show_new_' + section] = false;
            }
            $scope.models[section]['change_' + section + '_form'].$setPristine();
            $scope.models[section]['change_' + section + '_form'].$setUntouched();
        };
        $scope.change_passcode = function () {
            if(($scope.models.passcode.old_passcode && $scope.models.passcode.old_passcode.length > 0) && ($scope.models.passcode.new_passcode && $scope.models.passcode.new_passcode.length > 0)) {
                if($scope.models.passcode.old_passcode == $scope.models.passcode.new_passcode) {
                    $scope.models.passcode.passcode_message = 'Invalid Passcode';
                } else {
                    api.save({ 'set' : 'login'} , { 'user_name' : $scope.user.user_name, 'password' : $scope.models.passcode.old_passcode }, function (data_login) {
                        if(data_login.success) {
                            api.save({ 'set' : 'user', 'id' : $scope.user.user_name } , { 'user_name' : $scope.user.user_name, 'password' : $scope.models.passcode.new_passcode }, function (data_change) {
                                if(data_change.success) {
                                    $scope.models.passcode.passcode_message = 'Passcode Changed';
                                    $scope.models.passcode.old_passcode = $scope.models.passcode.new_passcode = '';
                                    $scope.models.passcode.show_old_passcode = $scope.models.passcode.show_new_passcode = $scope.models.passcode.show_change_passcode = false;
                                } else {
                                    $scope.models.passcode.passcode_message = 'Passcode Change Failed';
                                }
                            });
                            $scope.models.passcode.passcode_message = '';
                        } else {
                            $scope.models.passcode.passcode_message = 'Invalid Passcode';
                        }
                    });
                }
            } else {
                $scope.models.passcode.passcode_message = 'Invalid Passcode';
            }
        };
        $scope.change_mail = function () {
            if(($scope.models.mail.new_mail && $scope.models.mail.new_mail.length > 0)) {
                api.save({ 'set' : 'user', 'id' : $scope.user.user_name } , { 'user_name' : $scope.user.user_name, 'mail' : $scope.models.mail.new_mail }, function (data_change) {
                    if(data_change.success) {
                        $scope.models.mail.mail_message = data_change.message;
                        $scope.models.mail.new_mail = '';
                        $scope.models.mail.show_change_mail = false;
                    } else {
                        $scope.models.mail.mail_message = 'Mail Change Failed';
                    }
                });
                $scope.models.mail.mail_message = '';
            } else {
                $scope.models.mail.mail_message = 'Invalid Mail';
            }
        };
        $scope.delete_account = function () {
            if(($scope.models.delete.old_delete && $scope.models.delete.old_delete.length > 0)) {
                api.save({ 'set' : 'login'} , { 'user_name' : $scope.user.user_name, 'password' : $scope.models.delete.old_delete }, function (data_login) {
                    if(data_login.success) {
                        api.save({ 'set' : 'user', 'id' : $scope.user.user_name } , { 'user_name' : $scope.user.user_name, 'delete' : moment().add(1, 'd').utc() }, function (data_change) {
                            if(data_change.success) {
                                $scope.models.delete.delete_message = data_change.message;
                                $scope.models.delete.old_delete = '';
                                $scope.models.delete.show_old_delete = $scope.models.delete.show_change_delete = false;
                                start_countdown(moment().utc().add(1, 'd'));
                            } else {
                                $scope.models.delete.delete_message = 'Action Failed. Please try again later.';
                            }
                        });
                        $scope.models.delete.delete_message = '';
                    } else {
                        $scope.models.delete.delete_message = 'Invalid Passcode';
                    }
                });
            } else {
                $scope.models.delete.delete_message = 'Invalid Passcode';
            }
        };
        $scope.cancel_termination = function () {
            api.save({ 'set' : 'user', 'id' : $scope.user.user_name } , { 'user_name' : $scope.user.user_name, 'delete' : undefined }, function (data_change) {
                if(data_change.success) {
                    $scope.models.delete.delete_message = 'Account Termination Cancelled';
                    $scope.models.delete.old_delete = '';
                    $scope.models.delete.show_old_delete = $scope.models.delete.show_change_delete = $scope.models.delete.countdown = false;
                    if(angular.isDefined($scope.interval)) {
                        $interval.cancel($scope.interval);
                        delete $scope.interval;
                    }
                } else {
                    $scope.models.delete.delete_message = 'Action Failed. Please try again later.';
                }
            });
        };
        $scope.add_platform = function () {
            if($scope.models.new_platform) {
                $scope.profile.platforms.push($scope.models.new_platform);
                $scope.models.new_platform = '';
                refresh_new_platforms();
            }
        };
        $scope.remove_platform = function (value) {
            $scope.profile.platforms.splice($scope.profile.platforms.indexOf(value), 1);
            refresh_new_platforms();
        };
        var start_countdown = function (time) {
            $scope.profile.delete = moment(time);
            if(moment().diff($scope.profile.delete) < 0) {
                $scope.interval = $interval(function() {
                    if(moment().diff($scope.profile.delete) < 0) {
                        $scope.models.delete.countdown = moment(moment($scope.profile.delete).diff()).utc().format('HH:mm:ss');
                    } else {
                        $scope.models.delete.countdown = false;
                        if(angular.isDefined($scope.interval)) {
                            $interval.cancel($scope.interval);
                            delete $scope.interval;
                        }
                        $state.go('list');
                    }
                }, 900);
            }
        };
        var populate_filters = function () {
            api.get({ 'set' : 'filter' }, function (filters) {
                var filter_types = {
                    'game' : filters.data[0].game,
                    'platform' : filters.data[0].platform
                };
                angular.forEach(filter_types, function (filter_values, filter_type) {
                    angular.forEach(filter_values, function (value) {
                        $scope.models.filter[filter_type][value] = value;
                    });
                });
                refresh_new_platforms();
            });
        }();
        var refresh_new_platforms = function () {
            if($scope.profile) {
                $scope.models.new_platforms = [];
                angular.forEach($scope.models.filter.platform, function (value) {
                    if($scope.profile.platforms.indexOf(value) < 0) {
                        $scope.models.new_platforms.push(value);
                    }
                }); 
            }
        };
        $scope.update_profile = function () {
            var timezone = (/^\([+-][0-9]{1,2}:[0-9]{1,2}\sGMT\)\s([A-Za-z/_]*)/g).exec($scope.profile.timezone)[1];
            var updated_profile = {
                'user_name' : $scope.user.user_name,
                'caption' : $scope.profile.caption,
                'seeking' : $scope.profile.seeking,
                'platforms' : $scope.profile.platforms,
                'play_start' : moment.tz(timezone).set({ 'hour' : moment($scope.models.play_start).format('HH'), 'minute' : moment($scope.models.play_start).format('mm') }).utc().format(),
                'play_end' : moment.tz(timezone).set({ 'hour' : moment($scope.models.play_end).format('HH'), 'minute' : moment($scope.models.play_end).format('mm') }).utc().format(),
                'timezone' : timezone
            };
            api.save({ 'set' : 'user', 'id' : $scope.user.user_name } , updated_profile, function (data_change) {
                if(data_change.success) {
                    $scope.$parent.timezone = '(' + moment.tz(timezone).format('Z')+' GMT) ' + timezone;
                    $scope.models.profile_form_status_message = 'Profile Updated';
                } else {
                    $scope.models.profile_form_status_message = 'Update Error';
                }
            });
        };
    }]);
