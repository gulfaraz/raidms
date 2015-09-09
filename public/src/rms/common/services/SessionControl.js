angular.module("rmsApp.shared")
    .factory("SessionControl", function () {
        var session = {
            "time" : moment().utc(),
            "user_name" : null,
            "user_id" : null,
            "filters" : {
                "access" : "",
                "platform" : "",
                "game" : ""
            }
        };
        return {
            "is_authenticated_user" : function () {
                return (session.user_name && (session.user_name.length > 0));
            },
            "get_user_name" : function () {
                return session.user_name;
            },
            "get_user_id" : function () {
                return session.user_id;
            },
            "get_filters" : function () {
                return session.filters;
            },
            "set_filter" : function (type, value) {
                session.filters[type] = value;
            },
            "set_user" : function (user_name, id) {
                session.user_name = user_name;
                session.user_id = id;
                session.time = moment().utc();
            },
            "clear_session" : function () {
                session.user_name = null;
                session.user_id = null;
                session.time = moment().utc();
            }
        };
    });
