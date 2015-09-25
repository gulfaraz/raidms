module.exports = function () {
    return {
        "name" : "Raid MS",
        "web" : {
            "scheme" : "http",
            "domain" : "raidms.com:8082",
            "port" : 8082
        },
        "application" : {
            "domain" : "raidms.com",
            "port" : 8082
        },
        "database" : {
            "scheme" : "mongodb",
            "domain" : "localhost",
            "port" : 27017,
            "dbname" : "rmsdev"
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
                "clientID" : "182493012083232",
                "clientSecret" : "8a0e7162e74be698ccada2ce786dd91b",
                "callbackURL" : "http://raidms.com:8082/auth/facebook/callback",
                "profileFields" : ["id", "emails", "name"]
            },
            "twitter" : {
                "consumerKey" : "lFZMyW3jPJr4wLT70F5YNylgk",
                "consumerSecret" : "WNB95WHMKPnq6aUfKYAJ3EFuY2V1du5mVYqWMJPkrjo7iamjad",
                "callbackURL" : "http://raidms.com:8082/auth/twitter/callback"
            },
            "google" : {
                "clientID" : "883974981493-gg5vabeuhus8h7rgt44b7l8ptqfjk8ne.apps.googleusercontent.com",
                "clientSecret" : "E9vvSsERn26dBGzdCD7QKcS3",
                "callbackURL" : "http://raidms.com:8082/auth/google/callback"
            },
            "xbox" : {
                "clientID" : "0000000044164666",
                "clientSecret" : "QV3nDtVir6BsdExFYNKjUqTp1Xmxp-vo",
                "callbackURL" : "http://raidms.com:8082/auth/xbox/callback"
            }
        },
        "secret" : "gulfaraz"
    }
};

