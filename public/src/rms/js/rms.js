angular.module('rmsApp', ['MainCtrl', 'TestService']);
angular.module('MainCtrl', ['ngResource', 'angularMoment']);
angular.module('MainCtrl').value('angularMomentConfig', {
    preprocess: 'utc',
    timezone: 'Europe/London'
});
