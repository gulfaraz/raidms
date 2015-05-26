angular.module('rmsApp.shared')
    .directive('available', ['$http', '$q', function ($http, $q) {
        return {
            'restrict' : 'A',
            'require' : 'ngModel',
            'link' : function (scope, elm, attrs, ngModel) {
                ngModel.$asyncValidators.duplicate = function (modelValue, viewValue) {
                    var userInput= modelValue || viewValue;
                    return $http.get('/check/' + userInput)
                        .then(function (response) {
                            if(response.data.available) {
                                return true;
                            } else {
                                return $q.reject();
                            }
                        }, function () {
                            return $q.reject();
                        });
                };
            }
        };
    }]);
