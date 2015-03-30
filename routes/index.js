module.exports = function(express, models) {
    var router = express.Router();
    router.use(function(req, res, next) {
        console.log('API Invoked');
        next();
    });
    router.get('/', function(req, res) {
        res.json({message: 'Welcome', 'status': 'OK'});
    });
    
    router.use('/user', require('./api/user')(router, models.User));
    return router;
}
