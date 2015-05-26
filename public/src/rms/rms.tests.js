describe('mainController', function () {

    beforeEach(module('rmsApp'));

    var scope, mainController;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        mainController = $controller('mainController', {
            $scope: scope
        });
    }));

    it('sets user name to empty string', function () {
        expect(scope.user.user_name).toBe('');
    });

    it('sets timzone to current timezone', function () {
        expect(scope.active_timezone).toBe(jstz.determine().name());
    });
});
