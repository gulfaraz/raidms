angular.module('rmsApp.shared')
    .filter('capitalize', function () {
      return function (input, scope) {
        if(input !== null && (typeof input == 'string' || input instanceof String)) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
      };
    })
    .filter('multiFilter', ['$filter', function ($filter) {
        return function (array, expression) {
            return array.filter(function(value, index) {
                var found = !expression.hasOwnProperty('$');
                var select = true;
                angular.forEach(expression, function (v, k) {
                    if(k === '$') {
                        angular.forEach(v.split(' '), function (keyword) {
                            keyword = keyword.toLowerCase();
                            if(keyword.length > 1) {
                                angular.forEach(value, function (data) {
                                    if((typeof data == 'string' || data instanceof String) && !found) {
                                        data = data.toLowerCase();
                                        found = (data.indexOf(keyword) > -1);
                                    }
                                });
                            } else {
                                found = true;
                            }
                        });
                    } else {
                        select = (select && (value[k].indexOf(v) > -1));
                    }
                });
                return found && select;
            });
        };
    }]);
