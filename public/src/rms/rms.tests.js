describe('mainController', function () {

    var test_scope;

    test_scope = this;

    this.pay_load = {
        'server_status' : 'Online',
        'users' : [
            { 'user_name' : 'gulfaraz' },
            {
                "_id": "554c9acd07b0ef4e416a06d7",
                "mail": "gulfarazyasin@gmail.com",
                "date_updated": "2015-05-26T08:48:06.922Z",
                "date_joined": "2015-04-01T05:08:43.000Z",
                "password": "passcode",
                "user_name": "mohsin",
                "status": "active",
                "social": {
                    "facebook": {
                        "linked": true,
                        "profile": {
                            "name": "mohsinfacebook"
                        }
                    }
                },
                "__v": 18,
                "platforms": [],
                "play_end": "2015-05-26T18:44:52.000Z",
                "play_start": "2015-05-27T01:28:52.000Z",
                "seeking": {
                    "message": "holla",
                    "game": null,
                    "platform": "XBOX"
                },
                "timezone": "America/Bogota",
                "caption": "Yo yo"
            },
            {
                "_id": "554c9acd07b0ef4e416a06d7",
                "mail": "gulfarazyasin@gmail.com",
                "date_updated": "2015-05-26T08:48:06.922Z",
                "date_joined": "2015-04-01T05:08:43.000Z",
                "password": "passcode",
                "user_name": "test",
                "status": "active",
                "social": {
                    "facebook": {
                        "linked": true,
                        "profile": {
                            "name": "mohsinfacebook"
                        }
                    }
                },
                "__v": 18,
                "platforms": [],
                "play_end": "2015-05-26T18:44:52.000Z",
                "play_start": "2015-05-27T01:28:52.000Z",
                "seeking": {
                    "message": "holla",
                    "game": null,
                    "platform": "XBOX"
                },
                "timezone": "America/Santiago",
                "caption": "Yo yo"
            },
            {
                "_id": "5576d514ce4c238f35a2a066",
                "play_end": "2015-06-09T13:59:16.340Z",
                "play_start": "2015-06-09T10:59:16.340Z",
                "date_updated": "2015-06-09T11:59:16.340Z",
                "date_joined": "2015-06-09T11:59:16.339Z",
                "karma": 0,
                "seeking": {
                    "game": "",
                    "platform": ""
                },
                "status": "registered",
                "role": "applicant",
                "timezone": "Asia/Kolkata",
                "mail": "gulfarazyasin@gmail.com",
                "password": "password",
                "user_name": "gulfi",
                "platforms": [],
                "__v": 0
            }
        ],
        'raids' : []
    };

    this.default = {
        'server_status' : 'Offline',
        'users' : []
    };

    var token_array = [undefined, 'gulfaraz', 'mohsin', 'test', 'gulfi'];

    function main_controller_tests(access_token) {

        describe('access_token - ' + access_token, function () {

            beforeEach(module('rmsApp'));

            var scope, mainController, $state, $httpBackend, api;

            beforeEach(inject(function ($rootScope, $controller, _api_, _$state_, _$httpBackend_, _$localStorage_) {

                scope = $rootScope.$new();
                api = _api_;
                $state = _$state_;
                $httpBackend = _$httpBackend_;
                $localStorage = _$localStorage_;

                spyOn($state, 'go');
                spyOn($localStorage, '$reset');

                $localStorage.token = access_token;

                mainController = $controller('mainController', {
                    '$scope' : scope
                });

                $httpBackend
                    .expect('GET', '/api')
                    .respond(200, { 'success' : true, 'status' : test_scope.pay_load.server_status });
                $httpBackend
                    .expect('GET', '/api/user')
                    .respond(200, { 'success' : true, 'data' : test_scope.pay_load.users });
                if($localStorage.token) {
                    $httpBackend
                        .expect('POST', '/api/login/' + $localStorage.token)
                        .respond(function (method, url, data, headers) {
                            var response = { 'success' : false, 'message' : 'Invalid Token' };
                            if(headers.Authorization.split(' ')[1] == $localStorage.token) {
                                for(var user in test_scope.pay_load.users) {
                                    user = test_scope.pay_load.users[user];
                                    if(user.user_name == $localStorage.token) {
                                        if(user.status == 'active') {
                                            response = { 'success': true, 'message': 'User Authenticated', 'user_name' : user.user_name, '_id' : user._id };
                                            break;
                                        } else {
                                            response = { 'success' : false, 'message' : 'Invalid Token' };
                                        }
                                    }
                                }
                            }
                            return [200, response, {}];
                        });
                    $httpBackend
                        .when('GET', '/api/user/' + $localStorage.token)
                        .respond(function (method, url, data, headers) {
                            var response = { 'success' : false, 'message' : 'Error' };
                            if(headers.Authorization.split(' ')[1] == $localStorage.token) {
                                for(var user in test_scope.pay_load.users) {
                                    user = test_scope.pay_load.users[user];
                                    if(user.user_name == $localStorage.token) {
                                        response = { 'success' : true, 'data' : user };
                                        break;
                                    }
                                }
                            }
                            return [200, response, {}];
                        });
                }
            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('user name defaults to an empty string', function () {
                expect(scope.user.user_name).toBe('');
                $httpBackend.flush();
                if($localStorage.token) {
                    expect(scope.user.user_name).toBe(function () {
                        for(var user in test_scope.pay_load.users) {
                            user = test_scope.pay_load.users[user];
                            if(user.user_name == $localStorage.token && user.status == 'active') {
                                return user.user_name;
                            }
                        }
                        return '';
                    }());
                } else {
                    expect(scope.user.user_name).toBe('');
                }
            });

            it('user id defaults to an empty string', function () {
                expect(scope.user._id).toBe('');
                $httpBackend.flush();
                if($localStorage.token) {
                    expect(scope.user._id).toBe(function () {
                        for(var user in test_scope.pay_load.users) {
                            user = test_scope.pay_load.users[user];
                            if(user.user_name == $localStorage.token && user.status == 'active') {
                                return user._id;
                            }
                        }
                        return '';
                    }());
                } else {
                    expect(scope.user._id).toBe('');
                }
            });

            it('active timezone updates on timezone change', function () {
                var current_active_timezone = scope.active_timezone;
                var new_timezone = jstz.olson.timezones[Object.keys(jstz.olson.timezones)[ Math.floor(Math.random() * Object.keys(jstz.olson.timezones).length) ]];
                scope.$apply(function () {
                    scope.timezone = ('(' + moment.tz(new_timezone).format('Z')+' GMT) ' + new_timezone);
                });
                expect(scope.active_timezone).toBe(new_timezone);
                $httpBackend.flush();
            });

            it('list of timezones are populated', function () {
                expect(Object.keys(scope.timezones).length).toBe(Object.keys(jstz.olson.timezones).length);
                $httpBackend.flush();
            });

            it('sets timzone to current timezone', function () {
                expect(scope.active_timezone).toBe(jstz.determine().name());
                $httpBackend.flush();
            });

            it('shows server status', function () {
                expect(scope.server_status).toBe(test_scope.default.server_status);
                $httpBackend.flush();
                expect(scope.server_status).toBe(test_scope.pay_load.server_status);
            });

            it('shows online users', function () {
                expect(scope.online_users).toBe(test_scope.default.users.length);
                $httpBackend.flush();
                expect(scope.online_users).toBe(test_scope.pay_load.users.length);
            });

            it('localize adds localized times to input', function () {
                scope.active_timezone = jstz.olson.timezones[Object.keys(jstz.olson.timezones)[ Math.floor(Math.random() * Object.keys(jstz.olson.timezones).length) ]];
                var format = 'h:mm A (Do MMM)';
                var play_time_format = 'h:mm A';

                var test_data_list = [
                        [],
                        [test_scope.pay_load.users[Math.floor(Math.random() * test_scope.pay_load.users.length)]],
                        test_scope.pay_load.users,
                        [test_scope.pay_load.raids[Math.floor(Math.random() * test_scope.pay_load.raids.length)]],
                        test_scope.pay_load.raids
                    ];

                for(var test_data in test_data_list) {
                    test_data = test_data_list[test_data];
                    var localized_data = scope.localize(test_data);
                    for(var i = 0; i<localized_data.length; i++) {
                        if(localized_data[i]) {
                            expect(localized_data[i].display_time_created).toBe(moment.tz(test_data[i].time_created, scope.active_timezone).format(format));
                            expect(localized_data[i].display_play_time).toBe(moment.tz(test_data[i].play_time, scope.active_timezone).format(format));
                            expect(localized_data[i].play_start.isSame(moment.tz(test_data[i].play_start, scope.active_timezone))).toBe(true);
                            expect(localized_data[i].play_end.isSame(moment.tz(test_data[i].play_end, scope.active_timezone))).toBe(true);
                            expect(localized_data[i].display_play_start).toBe(localized_data[i].play_start.format(play_time_format));
                            expect(localized_data[i].display_play_end).toBe(localized_data[i].play_end.format(play_time_format));
                            expect(localized_data[i].display_date_joined).toBe(moment.tz(test_data[i].date_joined, scope.active_timezone).format(format));
                        }
                    }
                    expect(localized_data.length).toBe(test_data.length);
                }

                $httpBackend.flush();
            });

            describe('sign in', function() {

                this.sign_in_list = [
                    {
                        'credentials' : {
                            'user_name' : undefined,
                            'passcode' : undefined
                        },
                        'message' : {
                            'pre' : 'Invalid Credentials',
                            'post' : 'Invalid Credentials'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : null,
                            'passcode' : null
                        },
                        'message' : {
                            'pre' : 'Invalid Credentials',
                            'post' : 'Invalid Credentials'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : '',
                            'passcode' : ''
                        },
                        'message' : {
                            'pre' : 'Invalid Credentials',
                            'post' : 'Invalid Credentials'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : 'gulfaraz',
                            'passcode' : ''
                        },
                        'message' : {
                            'pre' : 'Invalid Credentials',
                            'post' : 'Invalid Credentials'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : '',
                            'passcode' : 'passcode'
                        },
                        'message' : {
                            'pre' : 'Invalid Credentials',
                            'post' : 'Invalid Credentials'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : 'gulfaraz',
                            'passcode' : 'passcode'
                        },
                        'message' : {
                            'pre' : 'Signing In...',
                            'post' : 'Invalid Passcode'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : 'dummy',
                            'passcode' : 'dummy'
                        },
                        'message' : {
                            'pre' : 'Signing In...',
                            'post' : 'Invalid User Name'
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : 'mohsin',
                            'passcode' : 'passcode'
                        },
                        'message' : {
                            'pre' : 'Signing In...',
                            'post' : ''
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : 'test',
                            'passcode' : 'passcode'
                        },
                        'message' : {
                            'pre' : 'Signing In...',
                            'post' : ''
                        }
                    },
                    {
                        'credentials' : {
                            'user_name' : 'gulfi',
                            'passcode' : 'password'
                        },
                        'message' : {
                            'pre' : 'Signing In...',
                            'post' : 'Please check your registered mail to complete the registration'
                        }
                    }
                ];

                function sign_in_test(credentials, message) {
                    it('should login with ' + credentials.user_name + '/' + credentials.passcode + ' to give ' + message.pre + '/' + message.post, function () {
                        $httpBackend.flush();
                        if(message.pre === 'Signing In...') {
                            $httpBackend
                                .expect('POST', '/api/login')
                                .respond(function (method, url, data, headers) {
                                    var user_name;
                                    var _id;
                                    var status;
                                    var invalid_passcode = false;
                                    data = JSON.parse(data);
                                    for(var user in test_scope.pay_load.users) {
                                        user = test_scope.pay_load.users[user];
                                        if(user.user_name == data.user_name) {
                                            status = user.status;
                                            user_name = user.user_name;
                                            _id = user._id;
                                            if(user.password != data.password) {
                                                user_name = undefined;
                                                invalid_passcode = true;
                                            }
                                            break;
                                        }
                                    }
                                    var response = { 'success' : false, 'message' : 'Invalid Credentials' };
                                    if(user_name && user_name.length > 0) {
                                        if(status == 'active') {
                                            response = { 'success' : true, 'message' : 'User Authenticated', 'token' : user_name, 'user_name' : user_name, '_id' : _id };
                                        } else {
                                            response = { 'success' : false, 'message' : 'Please check your registered mail to complete the registration' };
                                        }
                                    } else {
                                        if(invalid_passcode) {
                                            response = { 'success' : false, 'message' : 'Invalid Passcode' };
                                        } else {
                                            response = { 'success' : false, 'message' : 'Invalid User Name' };
                                        }
                                    }
                                    return [200, response, {}];
                                });
                        }
                        if(message.post === '') {
                            $httpBackend
                                .when('GET', '/api/user/' + credentials.user_name)
                                .respond(function (method, url, data, headers) {
                                    var response = { 'success' : false, 'message' : 'Error' };
                                    expect(headers.Authorization.split(' ')[1]).toBe(credentials.user_name);
                                    if(headers.Authorization.split(' ')[1] == credentials.user_name) {
                                        for(var user in test_scope.pay_load.users) {
                                            user = test_scope.pay_load.users[user];
                                            if(user.user_name == credentials.user_name) {
                                                response = { 'success' : true, 'data' : user };
                                                break;
                                            }
                                        }
                                    }
                                    return [200, response, {}];
                                });
                        }

                        scope.user_name = credentials.user_name;
                        scope.passcode = credentials.passcode;

                        expect(scope.message).toBeUndefined();

                        scope.sign_in();

                        expect(scope.message).toBe(message.pre);

                        if(message.pre === 'Signing In...') {
                            $httpBackend.flush();
                        }
                        if(message.post === '') {
                            expect($localStorage.token).toBe(credentials.user_name);
                            expect(scope.user.user_name).toBe(credentials.user_name);
                            expect(scope.user._id).toBe(function () {
                                for(var user in test_scope.pay_load.users) {
                                    user = test_scope.pay_load.users[user];
                                    if(user.user_name == credentials.user_name) {
                                        return user._id;
                                    }
                                }
                                return false;
                            }());
                            expect(scope.timezone).toBe(function () {
                                for(var user in test_scope.pay_load.users) {
                                    user = test_scope.pay_load.users[user];
                                    if(user.user_name == credentials.user_name) {
                                        return ('(' + moment.tz(user.timezone).format('Z')+' GMT) ' + user.timezone);
                                    }
                                }
                            }());
                            expect(scope.show_login_passcode).toBe(false);
                        } else {
                            expect($localStorage.$reset).toHaveBeenCalled();
                            expect(scope.user.user_name).toBe('');
                            expect(scope.user._id).toBe('');
                        }
                        expect(scope.message).toBe(message.post);
                    });
                }

                for(var sign_in_attempt in this.sign_in_list) {
                    sign_in_test(this.sign_in_list[sign_in_attempt].credentials, this.sign_in_list[sign_in_attempt].message);
                }
            });

            it('sign out', function () {
                scope.user.user_name = test_scope.pay_load.users[Math.floor(Math.random() * test_scope.pay_load.users.length)].user_name;
                scope.active_timezone = jstz.olson.timezones[Object.keys(jstz.olson.timezones)[ Math.floor(Math.random() * Object.keys(jstz.olson.timezones).length) ]];
                scope.sign_out();
                expect($localStorage.$reset).toHaveBeenCalled();
                expect(scope.user.user_name).toBe('');
                expect(scope.user._id).toBe('');
                expect(scope.active_timezone).toBe(jstz.determine().name());
                $httpBackend.flush();
            });
        });

    }

    for(var access_token in token_array) {
        main_controller_tests(token_array[access_token]);
    }
});
