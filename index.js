var express = require('express');
var rms = express(); 

var bodyParser = require('body-parser');
rms.use(bodyParser.urlencoded({extended:true}));
rms.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rmsdev');

var models = require('./models/models');

var port = process.env.PORT || 8080;

rms.use('/', require('./routes/routes')(express, models));
rms.use(express.static(__dirname + '/public'), require('./routes/routes')(express, models));
rms.use('/', function(req, res) {
    res.sendFile('./public/views/index.html', { root: __dirname });
});

rms.listen(port);
console.log('Port ' + port + ' open and listening for requests');
