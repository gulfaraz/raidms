angular.module('MainCtrl')
    .controller('listController', ['$scope', 'api', '$stateParams', function($scope, api, $stateParams) {
        $scope.filterState = $stateParams.filterState || {
            'status' : '',
            'platform' : '',
            'game' : ''
        };
        $scope.statusFilter = {};
        $scope.platformFilter = {};
        $scope.gameFilter = {};
        $scope.get_raids = function get_raids(tableState) {
            tableState.search.predicateObject = tableState.search.predicateObject || $scope.filterState;
            angular.forEach(tableState.search.predicateObject, function(value, key) {
                if(value.length < 2) {
                    delete tableState.search.predicateObject[key];
                }
            });
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            api.get({ 'set' : 'raid', 'start' : start, 'number' : number, 'tableState' : tableState }, function(raids) {
                $scope.raids = $scope.localize(raids.data);
                tableState.pagination.numberOfPages = raids.numberOfPages;
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
        var populateFilters = function() {
            api.query({ 'set' : 'filter' }, function(filters) {
                var filter_types = {
                    'gameFilter' : filters[0].game,
                    'statusFilter' : filters[0].status,
                    'platformFilter' : filters[0].platform
                };
                angular.forEach(filter_types, function(filter_values, filter_type) {
                    angular.forEach(filter_values, function(value) {
                        $scope[filter_type][value] = value;
                    });
                });
            });
        };
        populateFilters();
    }]);
