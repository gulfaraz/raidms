angular.module('MainCtrl')
    .controller('listController', ['$scope', 'api', function($scope, api) {
        api.query({'set':'raid'}, function(data) {
            $scope.raids = $scope.localize(data);
        });
        $scope.$watch('active_timezone', function() {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function() {
            $scope.localize($scope.raids);
        };
        $scope.localize = function(raids) {
        	var format = 'h:mm A (Do MMM)';
            angular.forEach(raids, function(value, key) {
                value.display_time_created = moment.tz(value.time_created, $scope.active_timezone).format(format);
                value.display_play_time = moment.tz(value.play_time, $scope.active_timezone).format(format);
            });
            return raids;
        };
    }]);
