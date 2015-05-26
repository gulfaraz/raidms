angular.module('rmsApp.raid', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('raid', {
                'url' : '/raid/:raid_id',
                'params' : {
                    'filter_state' : {}
                },
                'templateUrl' : 'src/rms/raid/view/raid.html',
                'controller' : 'raidController'
            });
    }]);
