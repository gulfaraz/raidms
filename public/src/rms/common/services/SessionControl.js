angular.module("rmsApp.shared")
    .factory("SessionControl",
        ["$rootScope", "$state", "api", "amMoment",
        function ($rootScope, $state, api, amMoment) {

        var home_state = {
            "name" : "lfg",
            "params" : {}
        };

        var track_states = ["lfg", "lfm", "user", "raid"];

        var session = {
            "time" : moment().utc(),
            "user_name" : null,
            "user_id" : null,
            "is_admin" : false,
            "filters" : {
                "access" : "",
                "platform" : "",
                "game" : ""
            },
            "history" : function () {
                var history_list = [];
                for(var i = 0; i < 5; i++) {
                    history_list.push(home_state);
                }
                return history_list;
            }()
        };

        $rootScope.$on("$stateChangeStart", function (event, toState, toStateParameters, fromState, fromStateParameters) {
            if(track_states.indexOf(toState.name) > -1) {
                if(session.history.map(function (item) {
                    return JSON.stringify(item);
                }).indexOf(JSON.stringify({
                    "name" : toState.name,
                    "params" : toStateParameters
                })) < 0) {
                    session.history.pop();
                    session.history.unshift({
                        "name" : toState.name,
                        "params" : toStateParameters
                    });
                } else {
                    session.history.shift();
                    session.history.push(home_state);
                }
            }
        });

        return {
            "is_authenticated_user" : function () {
                return (session.user_name && (session.user_name.length > 0));
            },
            "is_admin" : function () {
                return session.is_admin;
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
            "set_user" : function (user_id) {
                session.time = moment().utc();
                api.get({ "set" : "user", "id" : user_id },
                    function (user) {
                        if(user.success) {
                            session.filters.platform = user.data.seeking.platform;
                            session.filters.game = user.data.seeking.game;
                            session.user_name = user.data.user_name;
                            session.user_id = user.data._id;
                            session.is_admin = (user.data.role === "moderator");
                            amMoment.changeTimezone(user.data.timezone || jstz.determine().name());
                            if($state.current.name === "lfg") {
                                $state.go("lfg", {}, { "reload" : true });
                            }
                        }
                    });
            },
            "clear_session" : function () {
                session.user_name = null;
                session.user_id = null;
                session.is_admin = false;
                session.time = moment().utc();
            },
            "get_back_state" : function () {
                var current_state = {
                    "name" : $state.current.name,
                    "params" : $state.params
                };
                var back_state = home_state;
                for(var i = 0, len = session.history.length; i < len; i++) {
                    if(JSON.stringify(current_state) !== JSON.stringify(session.history[i])) {
                        back_state = session.history[i];
                        break;
                    }
                }
                return back_state;
            }
        };
    }]);
