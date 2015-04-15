angular.module('MainCtrl')
    .controller('listController', ['$scope', 'api', function($scope, api) {
        //var ctrl = this;
        //$scope.show_raids = [];
        $scope.statusFilter = {};
        $scope.platformFilter = {};
        $scope.gameFilter = {};
        $scope.get_raids = function get_raids(tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 5;
            api.get({'set':'raid', 'start': start, 'number': number, 'tableState': tableState}, function(data) {
                $scope.raids = $scope.localize(data.data);
                $scope.populateFilters(data.data);
                tableState.pagination.numberOfPages = data.numberOfPages;
                $scope.show_raids = [].concat($scope.raids);
                $scope.isLoading = false;
            });
        };
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
        $scope.populateFilters = function(raids) {
            angular.forEach(raids, function(value, key) {
                $scope.statusFilter[value.status] = value.status;
                $scope.platformFilter[value.platform] = value.platform;
                $scope.gameFilter[value.game] = value.game;
            });
        };
    }]);
