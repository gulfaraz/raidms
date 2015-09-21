print(new Date() + " - SETUP DATABASE - START");

print("Load Configutation - START");

load("../config/" + (environment || "development") + ".js");
var database_config = module.exports().database;

print("CONFIGURATION - " + JSON.stringify(database_config));

print("Load Configutation - END");

var db = connect(database_config.domain + ":" + database_config.port + "/" + database_config.dbname);

var scripts = ["create_filters.js"];

print("Scripts to execute - " + scripts.length);

for(var i=0; i<scripts.length; i++) {
    print(scripts[i]);
    load(scripts[i]);
}

print(new Date() + " - SETUP DATABASE - END");
