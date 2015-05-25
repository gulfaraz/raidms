module.exports = function (util, express, models, auth) {
    var router = express.Router();
    var api_root = '/api';
    router.get(api_root, function (req, res) {
        res.json({ 'success' : true, 'message' : 'Welcome', 'status' : 'Online' });
    });
    router.use(api_root + '/user', require('./api/user')(util, express, models.User, auth));
    router.use(api_root + '/raid', require('./api/raid')(util, express, models.Raid, auth));
    router.use(api_root + '/filter', require('./api/filter')(util, express, models.Filter));
    router.use(api_root + '/client', require('./api/client')(util, express, models.Client, auth));
    router.use(api_root + '/oauth2', require('./api/oauth2')(util, express, auth));
    router.use(api_root + '/login', require('./api/login')(util, express, models.User, auth));

    router.use('/', require('./util')(util, express, models.User, auth));
    return router;
}
