module.exports = function (util, router, auth) {
    router.route('/oauth2/authorize')
        .post(auth.isAuthenticated, auth.oauth2.decision)
        .get(auth.isAuthenticated, auth.oauth2.authorization);
    router.route('/oauth2/token')
        .post(auth.isClientAuthenticated, auth.oauth2.token);
    return router;
}
