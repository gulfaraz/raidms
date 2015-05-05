angular.module('MainCtrl')
    .controller('mainController', ['$scope', 'api', '$state', '$localStorage', function ($scope, api, $state, $localStorage) {

        $state.go('list');

        $scope.user = {
            'time' : Date.now(),
            'username' : ''
        };

        $scope.active_timezone = jstz.determine().name();

        $scope.$watch('timezone', function () {
            $scope.change_active_timezone();
        });

        $scope.timezones = function () {
            var zones = {};
            angular.forEach(jstz.olson.timezones, function (value, key) {
                zones[key] = '(' + moment(moment()).tz(value).format('Z') +' GMT) ' + value;
            });
            return zones;
        }();

        $scope.timezone = '(' + moment(moment()).tz(jstz.determine().name()).format('Z')+' GMT) ' + jstz.determine().name();

        $scope.change_active_timezone = function () {
            $scope.active_timezone = (/^\([+-][0-9]{1,2}:[0-9]{1,2}\sGMT\)\s([A-Za-z/_]*)/g).exec($scope.timezone)[1];
        };

        api.get(function (data) {
            $scope.serverStatus = data.status;
        });
        api.get({ 'set' : 'user' }, function (users) {
            $scope.onlineUsers = users.data.length;
        });

        $scope.sign_in = function () {
            if(($scope.username && $scope.username.length > 0) || ($scope.passcode && $scope.passcode.length > 0)) {
                api.save({ 'set' : 'login'} , { 'username' : $scope.username, 'password' : $scope.passcode }, function (data) {
                    if(data.success) {
                        $localStorage.token = data.token;
                        $scope.user = {
                            'time' : Date.now(),
                            'username' : data.username
                        };
                        $scope.message = '';
                    } else {
                        $localStorage.$reset();
                        $scope.user = {
                            'time' : Date.now(),
                            'username' : ''
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
                'time' : Date.now(),
                'username' : ''
            };
        };

        if($localStorage.token) {
            api.save({ 'set' : 'login', 'id' : $localStorage.token }, {}, function (data) {
                if(data.success) {
                    $scope.user = {
                        'time' : Date.now(),
                        'username' : data.username
                    };
                } else {
                    $localStorage.$reset();
                    $scope.user = {
                        'time' : Date.now(),
                        'username' : ''
                    };
                }
            });
        }
    }]);
