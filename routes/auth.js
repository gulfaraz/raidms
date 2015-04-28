module.exports = function(router, auth) {
    router.route('/auth/facebook')
        .get(auth.isFacebookAuthenticated);
    router.route('/auth/facebook/callback')
        .get(auth.isFacebookAuthenticatedCallback);
    router.route('/auth/twitter')
        .get(auth.isTwitterAuthenticated);
    router.route('/auth/twitter/callback')
        .get(auth.isTwitterAuthenticatedCallback);
    router.route('/auth/google')
        .get(auth.isGoogleAuthenticated);
    router.route('/auth/google/callback')
        .get(auth.isGoogleAuthenticatedCallback);
    return router;
}
