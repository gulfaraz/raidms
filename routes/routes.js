module.exports = function(express, models) {
    var router = express.Router();
    router.use(function(req, res, next) {
        //console.log('API Invoked');
        next();
    });
    router.get('/api', function(req, res) {
        res.json({message: 'Welcome', 'status': 'Online'});
    });
    router.use('/api', require('./api/user')(router, models.User));
    router.use('/api', require('./api/raid')(router, models.Raid));
    router.use('/api', require('./api/filter')(router, models.Filter));
    return router;
}
