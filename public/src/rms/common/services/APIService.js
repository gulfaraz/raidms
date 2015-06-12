angular.module('rmsApp.shared')
    .factory('api', ['$resource', function ($resource) {
        return ($resource('/api/:set/:id', {}, {
            'cache' : { 'cache' : true, 'method' : 'GET' },
            'get' : { 'cache' : false, 'method' : 'GET' }
        }));
    }]);
