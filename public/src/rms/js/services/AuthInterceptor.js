angular.module('MainCtrl')
    .factory('AuthInterceptor', ['$window', '$q', '$localStorage', '$injector', function ($window, $q, $localStorage, $injector) {
        return {
            'request' : function (config) {
                config.headers = config.headers || {};
                if($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config || $q.when(config);
            },
            'response' : function (response) {
                if(response.status === 401) {
                    $injector.get('$state').transitionTo('list');
                    return $q.reject(response);
                }
                return response || $q.when(response);
            }
        };
    }]);
