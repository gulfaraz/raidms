angular.module('MainCtrl')
    .controller('mainController', ['$scope', 'api', '$state', '$localStorage', function ($scope, api, $state, $localStorage) {

        $state.go('list');

        $scope.user = {
            'time' : moment().utc(),
            'user_name' : ''
        };

        $scope.active_timezone = jstz.determine().name();

        $scope.$watch('timezone', function () {
            $scope.change_active_timezone();
        });

        $scope.timezones = function () {
            var zones = {};
            angular.forEach(jstz.olson.timezones, function (value, key) {
                zones[key] = '(' + moment.tz(value).format('Z') +' GMT) ' + value;
            });
            return zones;
        }();

        var detect_timezone = function () {
            $scope.timezone = '(' + moment.tz(jstz.determine().name()).format('Z')+' GMT) ' + jstz.determine().name();
        };
        detect_timezone();

        $scope.change_active_timezone = function () {
            $scope.active_timezone = (/^\([+-][0-9]{1,2}:[0-9]{1,2}\sGMT\)\s([A-Za-z/_]*)/g).exec($scope.timezone)[1];
        };

        api.get(function (data) {
            $scope.serverStatus = 'Offline';
            if(data.success) {
                $scope.serverStatus = data.status;
            }
        });
        api.get({ 'set' : 'user' }, function (users) {
            if(users.success) {
                $scope.onlineUsers = users.data.length;
            }
        });

        $scope.localize = function (data_array) {
            var format = 'h:mm A (Do MMM)';
            angular.forEach(data_array, function (value, key) {
                value.display_time_created = moment.tz(value.time_created, $scope.active_timezone).format(format);
                value.display_play_time = moment.tz(value.play_time, $scope.active_timezone).format(format);
                value.offset_time_created = moment.tz(value.time_created, $scope.active_timezone).fromNow();
                value.offset_play_time = moment.tz(value.play_time, $scope.active_timezone).fromNow();
                value.play_start = moment.tz(value.play_start, $scope.active_timezone);
                value.play_end = moment.tz(value.play_end, $scope.active_timezone);
                value.display_play_start = value.play_start.format(format);
                value.display_play_end = value.play_end.format(format);
                value.offset_play_start = value.play_start.fromNow();
                value.offset_play_end = value.play_end.fromNow();
                value.display_date_joined = moment.tz(value.date_joined, $scope.active_timezone).format(format);
                value.offset_date_joined = moment.tz(value.date_joined, $scope.active_timezone).fromNow();
            });
            return data_array;
        };

        $scope.sign_in = function () {
            if(($scope.user_name && $scope.user_name.length > 0) && ($scope.passcode && $scope.passcode.length > 0)) {
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
