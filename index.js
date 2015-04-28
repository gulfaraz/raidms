var express = require('express');
var rms = express(); 

var bodyParser = require('body-parser');
rms.use(bodyParser.urlencoded({ extended : true }));
rms.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rmsdev');

var models = require('./architecture/models');

var passport = require('passport');
var auth = require('./architecture/auth');
var oauth2 = require('./architecture/oauth2');

var session = require('express-session');

var swig = require('swig');
swig.setDefaults({ cache: false });

var port = process.env.PORT || 8080;

rms.engine('html', swig.renderFile);

rms.set('view engine', 'html');
rms.set('views', __dirname + '/views');
rms.set('view cache', false);

rms.use(session({ 'secret' : 'Super Secret Session Key', 'saveUninitialized' : true, 'resave' : true }));
rms.use(passport.initialize());
rms.use('/', require('./routes/routes')(express, models, auth, oauth2));
rms.use(express.static(__dirname + '/public'), require('./routes/routes')(express, models, auth, oauth2));
rms.use('/', function(req, res) { res.sendFile('./public/views/index.html', { root: __dirname }); });

rms.listen(port);
console.log('Port ' + port + ' open and listening for requests');
