angular.module("rmsApp.shared")
    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("AuthInterceptor");
    }]);
