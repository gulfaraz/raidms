angular.module('rmsApp.raid', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('raid', {
                'url' : '/raid/:raid_id',
                'params' : {
                    'filter_state' : {},
                    'message' : ''
                },
                'templateUrl' : '/html/raid.html',
                'controller' : 'raidController'
            })
            .state('editRaid', {
                'url' : '/raid/edit/:raid_id',
                'params' : {
                    'filter_state' : {},
                    'message' : ''
                },
                'templateUrl' : '/html/raidEdit.html',
                'controller' : 'raidEditController'
            });
    }]);
