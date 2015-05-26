angular.module('rmsApp.shared')
    .factory('api', ['$resource', function($resource) {
        return ($resource('/api/:set/:id', {}, {
            'get' : { 'cache' : true, 'method' : 'GET' },
            'retrieve' : { 'cache' : false, 'method' : 'GET' }
        }));
    }]);
