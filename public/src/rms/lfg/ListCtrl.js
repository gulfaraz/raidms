angular.module('rmsApp.lfg', ['smart-table', 'ui.router', 'rmsApp.raid'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('list', {
                'url' : '/lfg',
                'params' : {
                    'filter_state' : {},
                    'message' : ''
                },
                'templateUrl' : '/html/list.html',
                'controller' : 'listController'
            });
    }])
    .controller('listController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$parent.message = $stateParams.message;
        $scope.$watch('user.user_name', function () {
            if($scope.$parent.user.user_name.length > 0) {
                api.get({ 'set' : 'user', 'id' : $scope.user.user_name }, function (user) {
                    if(user.success) {
                        if(Object.keys($stateParams.filter_state).length <= 0) {
                            $state.go('list', { 'filter_state' : { 'access' : null, 'platform' : user.data.seeking.platform, 'game' : user.data.seeking.game } });
                        } else {
                            $scope.reset_filter_state = $stateParams.filter_state;
                        }
                    }
                });
            }
        });
        $scope.filter_state = angular.extend({ 'access' : '', 'platform' : '', 'game' : '' }, $stateParams.filter_state);
        $scope.access_filters = {};
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
            api.cache({ 'set' : 'filter' }, function (filters) {
                if(filters.success) {
                    var filter_types = {
                        'game_filters' : filters.data[0].game,
                        'access_filters' : filters.data[0].access,
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
        $scope.join_raid = function (raid_id) {
            var raid = get_raid(raid_id);
            if($scope.user.user_name.length > 0) {
                api.save({ 'set' : 'raid', 'id' : raid_id }, { 'action' : 'join' }, function (data) {
                    $scope.$parent.message = data.message;
                    if(data.success) {
                        if(raid.access == 'open') {
                            raid.players.push($scope.user._id);
                        } else if(raid.access == 'closed') {
                            raid.queue.push($scope.user._id);
                        }
                    }
                });
            } else {
                $state.go('register');
            }
        };
        $scope.leave_raid = function (raid_id) {
            var raid = get_raid(raid_id);
            if($scope.user.user_name.length > 0) {
                api.save({ 'set' : 'raid', 'id' : raid_id }, { 'action' : 'leave' }, function (data) {
                    $scope.$parent.message = data.message;
                    if(data.success) {
                        raid.players.splice(raid.players.indexOf($scope.user._id), 1);
                    }
                });
            } else {
                $state.go('register');
            }
        };
        var get_raid = function (raid_id) {
            var matched_raid;
            for(var raid in $scope.raids) {
                if($scope.raids[raid]._id == raid_id) {
                    matched_raid = $scope.raids[raid];
                    break;
                }
            }
            return matched_raid;
        };
    }]);
