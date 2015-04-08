angular.module('MainCtrl')
    .controller('mainController', ['$scope', 'api', 'angularMomentConfig', function($scope, api, angularMomentConfig) {

        //Timezone Select
        $scope.timezones = jstz.olson.timezones;
        $scope.timezone = jstz.determine().name();
        //console.log('test - ' + angularMomentConfig.timezone);
        $scope.test = angularMomentConfig.timezone;
        //$scope.test = moment();

        //$scope.timezones = $timezones.getZoneList($scope);
        //$scope.timezone = $timezones.getLocal();

        $scope.message = {
            text: 'hello world!',
            time: Date.now()
        };

        //Stats
        api.get(function(data) {
            $scope.serverStatus = data.status;
        });
        api.query({'set':'user'}, function(data) {
            $scope.onlineUsers = data.length;
        });
    }]);
