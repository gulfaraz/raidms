angular.module('MainCtrl')
    .factory('api', ['$resource', function($resource) {
        return ($resource('/api/:set/:id', {}, {
            'get' : { 'cache' : true, 'method' : 'GET' }
        }));
    }]);
