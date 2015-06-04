angular.module('rmsApp', ['rmsApp.shared', 'rmsApp.lfg', 'rmsApp.raid', 'rmsApp.profile'])
    .controller('mainController', ['$scope', 'api', '$state', '$localStorage', function ($scope, api, $state, $localStorage) {

        $state.go('list');

        $scope.user = {
            'time' : moment().utc(),
            'user_name' : ''
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
            angular.forEach(data_array, function (value, key) {
                if(value) {
                    value.display_time_created = moment.tz(value.time_created, $scope.active_timezone).format(format);
                    value.offset_time_created = moment(value.time_created).fromNow();

                    value.display_play_time = moment.tz(value.play_time, $scope.active_timezone).format(format);
                    value.offset_play_time = moment(value.play_time).fromNow();
                    value.play_start = moment.tz(value.play_start, $scope.active_timezone);
                    value.display_play_start = value.play_start.format(format);
                    value.offset_play_start = value.play_start.fromNow();

                    value.play_end = moment.tz(value.play_end, $scope.active_timezone);
                    value.display_play_end = value.play_end.format(format);
                    value.offset_play_end = value.play_end.fromNow();

                    value.display_date_joined = moment.tz(value.date_joined, $scope.active_timezone).format(format);
                    value.offset_date_joined = moment(value.date_joined).fromNow();
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
                            'user_name' : data.user_name
                        };
                        user_timezone();
                        $scope.message = '';
                        $scope.show_login_passcode = false;
                        $state.go('list');
                    } else {
                        $localStorage.$reset();
                        $scope.user = {
                            'time' : moment().utc(),
                            'user_name' : ''
                        };
                        $scope.message = 'Invalid Credentials';
                    }
                });
            } else {
                $localStorage.$reset();
                $scope.user = {
                    'time' : moment().utc(),
                    'user_name' : ''
                };
                $scope.message = 'Invalid Credentials';
            }
        };

        $scope.sign_out = function () {
            $localStorage.$reset();
            $scope.user = {
                'time' : moment().utc(),
                'user_name' : ''
            };
            detect_timezone();
            $state.go('list', { 'filter_state' : { 'status' : '', 'platform' : '', 'game' : '' } });
        };

        if($localStorage.token) {
            api.save({ 'set' : 'login', 'id' : $localStorage.token }, {}, function (data) {
                if(data.success) {
                    $scope.user = {
                        'time' : moment().utc(),
                        'user_name' : data.user_name
                    };
                    user_timezone();
                    $state.go('list');
                } else {
                    $localStorage.$reset();
                    $scope.user = {
                        'time' : moment().utc(),
                        'user_name' : ''
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
    }]);
