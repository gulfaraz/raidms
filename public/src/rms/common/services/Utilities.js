angular.module("rmsApp.shared")
    .factory("util", ["api", function (api) {

        var zones = [],
            filter_list = {},
            timezone_lookup = {};

        angular.forEach(jstz.olson.timezones, function (value, key) {
            zones.push({
                "display" : "(" + moment.tz(value).format("Z") + " GMT) " + value,
                "name" : value
            });
        });

        api.cache({ "set" : "filter" }, function (filters) {
            if(filters.success) {
                filter_list = filters.data[0];
                filter_list._id = null;
            }
        });

        zones.sort(function (a, b) { return a.offset - b.offset; });

        for (var i = 0, max = zones.length; i < max; i++) {
            timezone_lookup[zones[i].name] = zones[i];
        }

        return {
            "get_timezones" : function () {
                return zones;
            },
            "timezone_lookup" : timezone_lookup,
            "get_filter_list" : function (type) {
                return filter_list[type] || [];
            },
            "is_now_ahead" : function (time) {
                return (moment().diff(time) < 0);
            },
            "all_but" : function (key, obj) {
                var new_obj = {};
                angular.forEach(obj, function (v, k) {
                    if(k !== key) {
                        new_obj[k] = obj[k];
                    }
                });
                return new_obj;
            }
        };

    }]);
