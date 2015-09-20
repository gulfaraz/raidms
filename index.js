var config = require("./config/" + process.env.ENVIRONMENT + ".js")();

var express = require("express");
var rms = express();

var bodyParser = require("body-parser");
rms.use(bodyParser.urlencoded({ "extended" : true }));
rms.use(bodyParser.json());

var mongoose = require("mongoose");
mongoose.connect(config.database.scheme + "://" + config.database.domain + "/" + config.database.dbname);

var models = require("./architecture/models")();

var util = require("./util")(config);

var auth = require("./architecture/auth")(util, models.User, config.secret, config.social);

var session = require("express-session");

var swig = require("swig");
swig.setDefaults({ "cache" : false });

var port = config.web.port || process.env.PORT || 8080;

rms.engine("html", swig.renderFile);

rms.set("view engine", "html");
rms.set("views", __dirname + "/views");
rms.set("view cache", false);

rms.use(session({ "secret" : config.secret, "saveUninitialized" : true, "resave" : true }));
rms.use(auth.passport.initialize());

rms.use(require("connect-livereload")({ "port" : 35729 }));

rms.use(express.static(__dirname + "/public/dist"), require("./routes/routes")(util, express, models, auth));
rms.use("/", function (req, res) { res.sendFile("public/dist/html/rms.html", { "root" : __dirname }); });

var CronJob = require('cron').CronJob;

new CronJob("0 */15 * * * *", function () {
    models.Raid.remove({
        "play_time" : { "$lte": new Date((new Date) - 1000 * 60 * 15) }
    }, function (err, removed) {
        if(err) {
            console.log(new Date() + " - Error in removing expired Raids");
        } else {
            console.log(new Date() + " - Removed " + removed.result.n + " Expired Raids");
        }
    });
    models.User.remove({
        "delete" : { "$lte": new Date((new Date)) }
    }, function (err, removed) {
        if(err) {
            console.log(new Date() + " - Error in removing deleted Users");
        } else {
            console.log(new Date() + " - Removed " + removed.result.n + " Deleted Users");
        }
    });
}, null, true, 'UTC');

rms.listen(port);
console.log("Port " + port + " open and listening for requests");
