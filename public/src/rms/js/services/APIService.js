angular.module('MainCtrl')
    .factory('api', ['$resource', function($resource) {
        return ($resource('/api/:set/:id'));
    }]);
