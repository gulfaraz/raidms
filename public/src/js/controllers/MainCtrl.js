angular.module('MainCtrl')
    .controller('mainController', ['$scope', 'api', function($scope, api) {

        //Timezone Select
        $scope.timezones = jstz.olson.timezones;
        $scope.timezone = jstz.determine().name();

        //Stats
        api.get(function(data) {
            $scope.serverStatus = data.status;
        });
        api.query({'set':'user'}, function(data) {
            $scope.onlineUsers = data.length;
        });
    }]).controller('listController', ['$scope', 'api', function($scope, api) {

        $scope.message = "List";

    }]);
