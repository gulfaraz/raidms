angular.module('rmsApp', ['rmsApp.shared', 'rmsApp.profile', 'rmsApp.lfg', 'rmsApp.lfm'])
    .controller('mainController', ['$scope', 'api', '$state', '$localStorage', '$sce', function ($scope, api, $state, $localStorage, $sce) {

        if(document.getElementById('content')) {
            document.getElementById('content').style.visibility = "visible";
        }

        $scope.user = {
            'time' : moment().utc(),
            'user_name' : '',
            '_id' : ''
        };

        $scope.$watch('timezone', function () {
            $scope.change_active_timezone();
        });

        $scope.change_active_timezone = function () {
            $scope.active_timezone = (/^\([+-][0-9]{1,2}:[0-9]{1,2}\sGMT\)\s([A-Za-z/_]*)/g).exec($scope.timezone)[1];
        };

        $scope.timezones = function () {
            var zones = {};
            angular.forEach(jstz.olson.timezones, function (value, key) {
                zones[key] = '(' + moment.tz(value).format('Z') +' GMT) ' + value;
            });
            return zones;
        }();

        var detect_timezone = function () {
            $scope.active_timezone = jstz.determine().name();
            $scope.timezone = '(' + moment.tz(jstz.determine().name()).format('Z')+' GMT) ' + jstz.determine().name();
        };
        detect_timezone();

        $scope.server_status = 'Offline';
        api.get(function (data) {
            if(data.success) {
                $scope.server_status = data.status;
            }
        });

        $scope.online_users = 0;
        api.get({ 'set' : 'user' }, function (users) {
            if(users.success) {
                $scope.online_users = users.data.length;
            }
        });

        $scope.localize = function (data_array) {
            var format = 'h:mm A (Do MMM)';
            var play_time_format = 'h:mm A';
            angular.forEach(data_array, function (value, key) {
                if(value) {
                    value.display_time_created = moment.tz(value.time_created, $scope.active_timezone).format(format);
                    value.display_play_time = moment.tz(value.play_time, $scope.active_timezone).format(format);

                    value.display_date_joined = moment.tz(value.date_joined, $scope.active_timezone).format(format);
                    value.play_start = moment().tz($scope.active_timezone).set({'hour': moment.tz(value.play_start, $scope.active_timezone).hour(), 'minute': moment.tz(value.play_start, $scope.active_timezone).minute()});
                    value.display_play_start = value.play_start.format(play_time_format);
                    value.play_end = moment().tz($scope.active_timezone).set({'hour': moment.tz(value.play_end, $scope.active_timezone).hour(), 'minute': moment.tz(value.play_end, $scope.active_timezone).minute()});
                    value.display_play_end = value.play_end.format(play_time_format);
                }
            });
            return data_array;
        };

        $scope.sign_in = function () {
            if(($scope.user_name && $scope.user_name.length > 0) && ($scope.passcode && $scope.passcode.length > 0)) {
                $scope.message = 'Signing In...';
                api.save({ 'set' : 'login'} , { 'user_name' : $scope.user_name, 'password' : $scope.passcode }, function (data) {
                    if(data.success) {
                        $localStorage.token = data.token;
                        $scope.user = {
                            'time' : moment().utc(),
                            'user_name' : data.user_name,
                            '_id' : data._id
                        };
                        user_timezone();
                        $scope.message = '';
                        $scope.show_login_passcode = false;
                    } else {
                        $localStorage.$reset();
                        $scope.user = {
                            'time' : moment().utc(),
                            'user_name' : '',
                            '_id' : ''
                        };
                        $scope.message = data.message;
                    }
                });
            } else {
                $localStorage.$reset();
                $scope.user = {
                    'time' : moment().utc(),
                    'user_name' : '',
                    '_id' : ''
                };
                $scope.message = 'Invalid Credentials';
            }
        };

        $scope.sign_out = function () {
            $localStorage.$reset();
            $scope.user = {
                'time' : moment().utc(),
                'user_name' : '',
                '_id' : ''
            };
            detect_timezone();
        };

        if($localStorage.token) {
            api.save({ 'set' : 'login', 'id' : $localStorage.token }, {}, function (data) {
                if(data.success) {
                    $scope.user = {
                        'time' : moment().utc(),
                        'user_name' : data.user_name,
                        '_id' : data._id
                    };
                    user_timezone();
                } else {
                    $localStorage.$reset();
                    $scope.user = {
                        'time' : moment().utc(),
                        'user_name' : '',
                        '_id' : ''
                    };
                }
            });
        }

        var user_timezone = function () {
            api.get({ 'set' : 'user', 'id' : $scope.user.user_name }, function (user) {
                if(user.success && (typeof user.data.timezone != 'undefined')) {
                    $scope.timezone = '(' + moment.tz(user.data.timezone).format('Z')+' GMT) ' + user.data.timezone;
                }
            });
        };

        $scope.trustAsHtml = function (message) {
            return $sce.trustAsHtml(message);
        };
    }]);
