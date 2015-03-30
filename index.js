var express = require('express');
var rms = express(); 

var bodyParser = require('body-parser');
rms.use(bodyParser.urlencoded({extended:true}));
rms.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gulfarazdev');

var models = {
    User: require('./models/user')
};

var port = process.env.PORT || 8080;

rms.use('/api', require('./routes/index')(express, models));

rms.listen(port);
console.log('Port ' + port + ' open and listening for requests');
