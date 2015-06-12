angular.module('rmsApp.raid')
    .controller('raidEditController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$parent.message = $stateParams.message;
        $scope.filter_state = $stateParams.filter_state || { 'status' : '', 'platform' : '', 'game' : '' };
        if($scope.user.user_name.length <= 0) {
            $state.go('register');
        }
        $scope.raid_times = {
            'hour' : {
                '0' : '0',
                '1' : '1',
                '2' : '2'
            },
            'minute' : {
                '05' : '05',
                '15' : '15',
                '30' : '30',
                '45' : '45'
            }
        };
        $scope.raid = {
            'strength' : 6,
            'time' : {
                'hour' : '0',
                'minute' : '15'
            },
            'status' : 'open'
        };
        $scope.models = {
            'filter' : {
                'platform' : {},
                'game' : {}
            }
        };
        if($stateParams.raid_id) {
            api.get({ 'set' : 'raid', 'id' : $stateParams.raid_id }, function (raid) {
                if(raid.success) {
                    $scope.raid = angular.extend($scope.raid, $scope.localize([raid.data])[0]);
                    $scope.player_data = {};
                    angular.forEach($scope.raid.players, function (player) {
                        api.cache({ 'set' : 'user', 'id' : player }, function (user) {
                            if(user.success) {
                                $scope.player_data[player] = $scope.localize([user.data])[0];
                                $scope.player_data[player].show = false;
                            }
                        });
                    });
                }
            });
        } else if($scope.user.user_name.length > 0) {
            api.get({ 'set' : 'user', 'id' : $scope.user.user_name }, function (user) {
                if(user.success) {
                    $scope.raid.platform = user.data.seeking.platform;
                    $scope.raid.game = user.data.seeking.game;
                    $scope.raid.description = user.data.seeking.message;
                }
            });
        }
        var populate_filters = function () {
            api.cache({ 'set' : 'filter' }, function (filters) {
                var filter_types = {
                    'game' : filters.data[0].game,
                    'platform' : filters.data[0].platform
                };
                angular.forEach(filter_types, function (filter_values, filter_type) {
                    angular.forEach(filter_values, function (value) {
                        $scope.models.filter[filter_type][value] = value;
                    });
                });
            });
        }();
        $scope.create_update_raid = function () {
            var raid = angular.extend($scope.raid,
                    {
                        'user_name' : $scope.user.user_name,
                        'play_time' : moment.utc().add($scope.raid.time.hour, 'hour').add($scope.raid.time.minute, 'minute')
                    }
                );
            if($stateParams.raid_id) {
                api.save({ 'set' : 'raid', 'id' : $stateParams.raid_id } , raid, function (data) {
                    if(data.success) {
                        $state.go('raid', { 'raid_id' : $stateParams.raid_id, 'message' : data.message });
                    } else {
                        $scope.$parent.message = data.message;
                    }
                });
            } else {
                api.save({ 'set' : 'raid' } , raid, function (data) {
                    if(data.success) {
                        $state.go('raid', { 'raid_id' : data.raid_id, 'message' : data.message });
                    } else {
                        $scope.$parent.message = data.message;
                    }
                });
            }
        };
    }]);
