module.exports = function (util, express, auth) {
    var router = express.Router();
    router.route('/authorize')
        .post(auth.isAuthenticated, auth.oauth2.decision)
        .get(auth.isAuthenticated, auth.oauth2.authorization);
    router.route('/token')
        .post(auth.isClientAuthenticated, auth.oauth2.token);
    return router;
}
