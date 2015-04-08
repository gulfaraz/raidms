angular.module('MainCtrl')
    .controller('mainController', ['$scope', 'api', function($scope, api) {

        $scope.active_timezone = jstz.determine().name();

        $scope.$watch('timezone', function() {
            $scope.change_active_timezone();
        });

        //Timezone Select
        $scope.timezones = function() {
            var zones = {};
            angular.forEach(jstz.olson.timezones, function(value, key) {
                zones[key] = '(' + moment(moment()).tz(value).format('Z') +' GMT) ' + value;
            });
            return zones;
        }();

        $scope.timezone = '(' + moment(moment()).tz(jstz.determine().name()).format('Z')+' GMT) ' + jstz.determine().name();
        //moment.tz.setDefault($scope.timezone);

        $scope.message = {
            text: 'hello world!',
            time: Date.now()
        };

        $scope.change_active_timezone = function() {
            $scope.active_timezone = (/^\([+-][0-9]{1,2}:[0-9]{1,2}\sGMT\)\s([A-Za-z/_]*)/g).exec($scope.timezone)[1];
            $scope.test = moment(moment()).tz($scope.active_timezone).format('Z');
        };

        //Stats
        api.get(function(data) {
            $scope.serverStatus = data.status;
        });
        api.query({'set':'user'}, function(data) {
            $scope.onlineUsers = data.length;
        });
    }]);
