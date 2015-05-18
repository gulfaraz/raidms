angular.module('MainCtrl')
    .controller('listController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$watch('user.user_name', function () {
            if($scope.$parent.$parent.user.user_name.length > 0) {
                api.get({ 'set' : 'user', 'id' : $scope.user.user_name }, function (user) {
                    if(user.success) {
                        $state.go('list', { 'filterState' : { 'platform' : user.data[0].seeking.platform, 'game' : user.data[0].seeking.game } });
                    }
                });
            }
        });
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
            angular.forEach(tableState.search.predicateObject, function (value, key) {
                if(value.length < 2) {
                    delete tableState.search.predicateObject[key];
                }
            });
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            api.get({ 'set' : 'raid', 'start' : start, 'number' : number, 'tableState' : tableState }, function (raids) {
                $scope.raids = $scope.localize(raids.data);
                tableState.pagination.numberOfPages = raids.numberOfPages;
                $scope.show_raids = [].concat($scope.raids);
                $scope.isLoading = false;
            });
        };
        $scope.$watch('active_timezone', function () {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function () {
            $scope.localize($scope.raids);
        };
        var populate_filters = function () {
            api.get({ 'set' : 'filter' }, function (filters) {
                var filter_types = {
                    'gameFilter' : filters.data[0].game,
                    'statusFilter' : filters.data[0].status,
                    'platformFilter' : filters.data[0].platform
                };
                angular.forEach(filter_types, function (filter_values, filter_type) {
                    angular.forEach(filter_values, function (value) {
                        $scope[filter_type][value] = value;
                    });
                });
            });
        }();
    }]);
