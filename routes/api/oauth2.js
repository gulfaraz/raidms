module.exports = function(router, auth, oauth2) {
    router.route('/oauth2/authorize')
        .post(auth.isAuthenticated, oauth2.decision)
        .get(auth.isAuthenticated, oauth2.authorization);
    router.route('/oauth2/token')
        .post(auth.isClientAuthenticated, oauth2.token);
    return router;
}
