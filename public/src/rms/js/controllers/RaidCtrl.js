angular.module('MainCtrl')
    .controller('raidController', ['$scope', 'api', '$stateParams', function ($scope, api, $stateParams) {
        $scope.filter_state = $stateParams.filter_state || { 'status' : '', 'platform' : '', 'game' : '' };
        api.get({ 'set' : 'raid', 'id' : $stateParams.raid_id }, function (raid) {
            $scope.raid = $scope.localize([raid.data])[0];
            $scope.player_data = {};
            angular.forEach($scope.raid.players, function (player) {
                api.get({ 'set' : 'user', 'id' : player }, function (user) {
                    $scope.player_data[player] = user.data[0];
                    $scope.player_data[player].show = false;
                });
            });
        });
        $scope.$watch('active_timezone', function () {
            $scope.update_to_active_timezone();
        });
        $scope.update_to_active_timezone = function () {
            if($scope.raid) {
                $scope.localize([$scope.raid]);
            }
        };
    }]);
