angular.module('rmsApp.raid', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('raid', {
                'url' : '/raid/:raid_id',
                'params' : {
                    'filter_state' : {},
                    'message' : ''
                },
                'templateUrl' : 'src/rms/raid/view/raid.html',
                'controller' : 'raidController'
            })
            .state('editRaid', {
                'url' : '/raid/edit/:raid_id',
                'params' : {
                    'filter_state' : {},
                    'message' : ''
                },
                'templateUrl' : 'src/rms/raid/edit/raidEdit.html',
                'controller' : 'raidEditController'
            });
    }]);
