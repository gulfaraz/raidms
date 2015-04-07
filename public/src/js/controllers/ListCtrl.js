angular.module('MainCtrl')
    .controller('listController', ['$scope', 'api', function($scope, api) {
        api.query({'set':'raid'}, function(data) {
            for(var x in data) {
                //data[x].time_created = moment(data[x].time_created).tz($scope.timezone);
                //data[x].play_time = moment(data[x].time_created).tz($scope.timezone);
            }
            $scope.raids = data;
        });
    }]);
