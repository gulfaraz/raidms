module.exports = function (util, router, models, auth) {
    router.get('/api', function (req, res) {
        res.json({message: 'Welcome', 'status': 'Online'});
    });
    router.use('/api', require('./api/user')(util, router, models.User, auth));
    router.use('/api', require('./api/raid')(util, router, models.Raid, auth));
    router.use('/api', require('./api/filter')(util, router, models.Filter));
    router.use('/api', require('./api/client')(util, router, models.Client, auth));
    router.use('/api', require('./api/oauth2')(util, router, auth));
    return router;
}
