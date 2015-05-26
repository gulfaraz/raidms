var express = require('express');
var rms = express();

var bodyParser = require('body-parser');
rms.use(bodyParser.urlencoded({ 'extended' : true }));
rms.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rmsdev');

var models = require('./architecture/models');

var auth = require('./architecture/auth');

var session = require('express-session');

var swig = require('swig');
swig.setDefaults({ 'cache' : false });

var util = require('./util')(auth);

var port = process.env.PORT || 8080;

rms.engine('html', swig.renderFile);

rms.set('view engine', 'html');
rms.set('views', __dirname + '/views');
rms.set('view cache', false);

rms.use(session({ 'secret' : 'gulfaraz', 'saveUninitialized' : true, 'resave' : true }));
rms.use(auth.passport_init);

rms.use(express.static(__dirname + '/public'), require('./routes/routes')(util, express, models, auth));
rms.use('/', function (req, res) { res.sendFile('./public/rms/index.html', { 'root' : __dirname }); });

rms.listen(port);
console.log('Port ' + port + ' open and listening for requests');
