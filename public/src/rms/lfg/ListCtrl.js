angular.module('rmsApp.lfg', ['smart-table'])
    .controller('listController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$watch('user.user_name', function () {
            if($scope.$parent.$parent.user.user_name.length > 0) {
                api.get({ 'set' : 'user', 'id' : $scope.user.user_name }, function (user) {
                    if(user.success) {
                        if(Object.keys($stateParams.filter_state).length <= 0) {
                            $state.go('list', { 'filter_state' : { 'status' : 'open', 'platform' : user.data.seeking.platform, 'game' : user.data.seeking.game } });
                        } else {
                            $scope.reset_filter_state = $stateParams.filter_state;
                        }
                    }
                });
            }
        });
        $scope.filter_state = angular.extend({ 'status' : '', 'platform' : '', 'game' : '' }, $stateParams.filter_state);
        $scope.status_filters = {};
        $scope.platform_filters = {};
        $scope.game_filters = {};
        $scope.get_raids = function get_raids(tableState) {
            tableState.search.predicateObject = tableState.search.predicateObject || $scope.filter_state;
            angular.forEach(tableState.search.predicateObject, function (value, key) {
                if((typeof value == 'string') && value.length < 2) {
                    delete tableState.search.predicateObject[key];
                }
            });
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            api.get({ 'set' : 'raid', 'start' : start, 'number' : number, 'tableState' : tableState }, function (raids) {
                if(raids.success) {
                    $scope.raids = $scope.localize(raids.data);
                    tableState.pagination.numberOfPages = raids.numberOfPages;
                    $scope.show_raids = [].concat($scope.raids);
                    $scope.isLoading = false;
                }
            });
        };
        $scope.$watch('active_timezone', function () {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function () {
            if($scope.raids) {
                $scope.localize($scope.raids);
            }
        };
        var populate_filters = function () {
            api.get({ 'set' : 'filter' }, function (filters) {
                if(filters.success) {
                    var filter_types = {
                        'game_filters' : filters.data[0].game,
                        'status_filters' : filters.data[0].status,
                        'platform_filters' : filters.data[0].platform
                    };
                    angular.forEach(filter_types, function (filter_values, filter_type) {
                        angular.forEach(filter_values, function (value) {
                            $scope[filter_type][value] = value;
                        });
                    });
                }
            });
        }();
    }]);
