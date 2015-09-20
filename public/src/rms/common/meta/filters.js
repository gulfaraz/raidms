angular.module("rmsApp.shared")
    .filter("capitalize", function () {
        return function (input) {
            return (input && input.length > 0) ? input.toString().charAt(0).toUpperCase() + input.slice(1) : input;
        };
    })
    .filter("multiFilter", function () {
        return function (array, expression) {
            return array.filter(function(value, index) {
                var found = !expression.hasOwnProperty("$");
                var select = true;
                angular.forEach(expression, function (v, k) {
                    if(k === "$") {
                        angular.forEach(v.split(" "), function (keyword) {
                            keyword = keyword.toLowerCase();
                            if(keyword.length > 1) {
                                angular.forEach(value, function (data) {
                                    if((data || data === "") && !found) {
                                        data = data.toString().toLowerCase();
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
    })
    .filter("unselected", function () {
        return function (array, selected_values) {
            return array.filter(function(value, index) {
                return (selected_values.indexOf(value) < 0);
            });
        };
    });
