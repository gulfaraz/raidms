angular.module('MainCtrl')
    .controller('raidController', ['$scope', 'api', '$stateParams', function($scope, api, $stateParams) {
        $scope.filterState = $stateParams.filterState || { 'status' : '', 'platform' : '', 'game' : '' };
        api.get({ 'set' : 'raid', 'id' : $stateParams.raid_id }, function(raid) {
            $scope.raid = $scope.localize(raid);
            $scope.player_data = {};
            angular.forEach($scope.raid.players, function(player) {
                api.get({ 'set' : 'user', 'id' : player }, function(user) {
                    $scope.player_data[player] = user;
                    $scope.player_data[player].show = false;
                });
            });
        });
        $scope.$watch('active_timezone', function() {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function() {
            if($scope.raid) {
                $scope.localize($scope.raid);
            }
        };
        $scope.localize = function(raid) {
            var format = 'h:mm A (Do MMM)';
            raid.display_time_created = moment.tz(raid.time_created, $scope.active_timezone).format(format);
            raid.display_play_time = moment.tz(raid.play_time, $scope.active_timezone).format(format);
            raid.offset_time_created = moment.tz(raid.time_created, $scope.active_timezone).fromNow();
            raid.offset_play_time = moment.tz(raid.play_time, $scope.active_timezone).fromNow();
            return raid;
        };
    }]);
