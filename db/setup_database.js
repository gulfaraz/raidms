print("SETUP DATABASE - START");

print("Load Configutation - START");

load("../config.js");
var database_config = module.exports().database;

print("Load Configutation - END");

var db = connect(database_config.domain + ":" + database_config.port + "/" + database_config.dbname);

var scripts = ["create_filters.js"];

print("Scripts to execute - " + scripts.length);

for(var i=0; i<scripts.length; i++) {
    print(scripts[0]);
    load(scripts[0]);
}

print("SETUP DATABASE - END");

