module.exports = function (WebEvent) {
    return function (req, res, next) {
        var web_event = new WebEvent();
        web_event.time = (new Date()).toUTCString();
        web_event.url = req.url;
        web_event.session_id = req.sessionID;
        web_event.user_agent = req.headers["user-agent"];
        web_event.referer = req.headers.referer;
        web_event.with_auth_token = !!req.headers.authorization;
        web_event.is_authenticated = !!req.session.passport.user;
        web_event.save(function (err) {
            if(err) {
                console.log(err.toString());
            } else {
                console.log(web_event.url);
            }
        });
        next();
    };
}
