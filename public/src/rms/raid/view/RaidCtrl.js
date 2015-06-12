    angular.module('rmsApp.raid')
    .controller('raidController', ['$scope', 'api', '$stateParams', '$state', function ($scope, api, $stateParams, $state) {
        $scope.$parent.message = $stateParams.message;
        $scope.filter_state = $stateParams.filter_state || { 'status' : '', 'platform' : '', 'game' : '' };
        api.get({ 'set' : 'raid', 'id' : $stateParams.raid_id }, function (raid) {
            if(raid.success) {
                $scope.raid = $scope.localize([raid.data])[0];
                $scope.player_data = {};
                $scope.queue_data = {};
                angular.forEach($scope.raid.players, function (player) {
                    api.cache({ 'set' : 'user', 'id' : player }, function (user) {
                        if(user.success) {
                            $scope.player_data[player] = $scope.localize([user.data])[0];
                            $scope.player_data[player].show = false;
                        }
                    });
                });
                angular.forEach($scope.raid.queue, function (requester) {
                    api.cache({ 'set' : 'user', 'id' : requester }, function (user) {
                        if(user.success) {
                            $scope.queue_data[requester] = $scope.localize([user.data])[0];
                            $scope.queue_data[requester].show = false;
                        }
                    });
                });
            }
        });
        $scope.$watch('active_timezone', function () {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function () {
            if($scope.raid) {
                $scope.localize([$scope.raid]);
            }
        };
        $scope.join_raid = function () {
            if($scope.user.user_name.length > 0) {
                api.save({ 'set' : 'raid', 'id' : $stateParams.raid_id }, { 'action' : 'join' }, function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        if($scope.raid.status == 'open') {
                            $scope.raid.players.push($scope.user._id);
                            api.cache({ 'set' : 'user', 'id' : $scope.user._id }, function (user) {
                                if(user.success) {
                                    $scope.player_data[$scope.user._id] = $scope.localize([user.data])[0];
                                    $scope.player_data[$scope.user._id].show = false;
                                }
                            });
                        } else if($scope.raid.status == 'closed') {
                            $scope.raid.queue.push($scope.user._id);
                            api.cache({ 'set' : 'user', 'id' : $scope.user._id }, function (user) {
                                if(user.success) {
                                    $scope.queue_data[$scope.user._id] = $scope.localize([user.data])[0];
                                    $scope.queue_data[$scope.user._id].show = false;
                                }
                            });
                        }
                    }
                });
            } else {
                $state.go('register');
            }
        };
        $scope.leave_raid = function () {
            if($scope.user.user_name.length > 0) {
                api.save({ 'set' : 'raid', 'id' : $stateParams.raid_id }, { 'action' : 'leave' }, function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        $scope.raid.players.splice($scope.raid.players.indexOf($scope.user._id), 1);
                        delete $scope.player_data[$scope.user._id];
                    }
                });
            } else {
                $state.go('register');
            }
        };
        $scope.approve_request = function (player) {
            if($scope.user.user_name.length > 0) {
                api.save({ 'set' : 'raid', 'id' : $stateParams.raid_id }, { 'action' : 'admit', 'player' : player }, function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        $scope.raid.players.push(player);
                        $scope.raid.queue.splice($scope.raid.queue.indexOf(player), 1);
                        $scope.player_data[player] = $scope.queue_data[player];
                        delete $scope.queue_data[player];
                    }
                });
            } else {
                $state.go('register');
            }
        };
        $scope.expel_player = function (player) {
            if($scope.user.user_name.length > 0) {
                api.save({ 'set' : 'raid', 'id' : $stateParams.raid_id }, { 'action' : 'expel', 'player' : player }, function (raid) {
                    $scope.action_status = raid.message;
                    if(raid.success) {
                        $scope.raid.players.splice($scope.raid.players.indexOf(player), 1);
                        delete $scope.player_data[player];
                    }
                });
            } else {
                $state.go('register');
            }
        };
    }]);
