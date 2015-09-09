angular.module("rmsApp.shared")
    .factory("AuthInterceptor",
        ["$window", "$q", "$localStorage", "$injector",
        function ($window, $q, $localStorage, $injector) {

        return {
            "request" : function (config) {
                config.headers = config.headers || {};
                if($localStorage.rms) {
                    config.headers.Authorization = "Bearer " + $localStorage.rms;
                }
                return config || $q.when(config);
            },
            "response" : function (response) {
                if(response.status === 401) {
                    $injector.get("$state").transitionTo("lfg");
                    return $q.reject(response);
                }
                return response || $q.when(response);
            }
        };

    }]);
