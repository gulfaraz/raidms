module.exports = function (util, express, models, auth) {
    var router = express.Router();
    var api_root = '/api';
    router.get(api_root, function (req, res) {
        res.json({ 'success' : true, 'message' : 'Welcome', 'status' : 'Online' });
    });
    router.use(api_root + '/user', require('./api/user')(util, express.Router(), models.User, auth));
    router.use(api_root + '/raid', require('./api/raid')(util, express.Router(), models.Raid, auth));
    router.use(api_root + '/filter', require('./api/filter')(express.Router(), models.Filter));
    router.use(api_root + '/login', require('./api/login')(express.Router(), models.User, auth));

    router.use('/', require('./util')(util, express.Router(), models.User, auth));
    return router;
}

