module.exports = function(express, models, auth, oauth2) {
    var router = express.Router();
    router.use(function(req, res, next) {
        next();
    });
    router.get('/api', function(req, res) {
        res.json({message: 'Welcome', 'status': 'Online'});
    });
    router.use('/api', require('./api/user')(router, models.User, auth));
    router.use('/api', require('./api/raid')(router, models.Raid, auth));
    router.use('/api', require('./api/filter')(router, models.Filter));
    router.use('/api', require('./api/client')(router, models.Client, auth));
    router.use('/api', require('./api/oauth2')(router, auth, oauth2));

    router.use('/auth', require('./auth')(router, auth));

    return router;
}
