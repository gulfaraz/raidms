module.exports = function () {
    return {
        "name" : "Raid MS",
        "web" : {
            "scheme" : "http",
            "domain" : "raidms.com",
            "port" : 8080
        },
        "application" : {
            "domain" : "raidms.com",
            "port" : 8080
        },
        "database" : {
            "scheme" : "mongodb",
            "domain" : "localhost",
            "port" : 27017,
            "dbname" : "raid_ms"
        },
        "mail" : {
            "host" : "smtp.zoho.com",
            "port" : 465,
            "secure" : true,
            "auth" : {
                "user" : "gulfaraz@raidms.com",
                "pass" : "raidms.com"
            },
            "tls" : {
                "rejectUnauthorized" : false
            }
        },
        "social" : {
            "facebook" : {
                "clientID" : "182263022106231",
                "clientSecret" : "c608aab0458ddeeff0cfd453793916d8",
                "callbackURL" : "http://raidms.com/auth/facebook/callback",
                "profileFields" : ["id", "emails", "name"],
                "passReqToCallback" : true
            },
            "twitter" : {
                "consumerKey" : "lFZMyW3jPJr4wLT70F5YNylgk",
                "consumerSecret" : "WNB95WHMKPnq6aUfKYAJ3EFuY2V1du5mVYqWMJPkrjo7iamjad",
                "callbackURL" : "http://raidms.com/auth/twitter/callback",
                "passReqToCallback" : true
            },
            "google" : {
                "clientID" : "823582476576-m5da8u6odojcksucd0nj8no9pfljmr5h.apps.googleusercontent.com",
                "clientSecret" : "xAZidTSI2tqulT7joNlOWxpe",
                "callbackURL" : "http://raidms.com/auth/google/callback",
                "passReqToCallback" : true
            }
        },
        "secret" : "7qkRUeqRKbi95405BvQBSrRWj284w95l"
    }
};

