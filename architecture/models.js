module.exports = function () {

    var mongoose = require("mongoose");
    var bcrypt = require("bcrypt-nodejs");
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        "user_name" : { "type" : String },
        "password" : { "type" : String },
        "mail" : { "type" : String, "lowercase" : true },
        "role" : String,
        "status" : String,
        "caption" : String,
        "karma" : Number,
        "play_start" : Date,
        "play_end" : Date,
        "platforms" : [String],
        "seeking" : Schema.Types.Mixed,
        "date_joined" : Date,
        "date_updated" : Date,
        "delete" : Date,
        "timezone" : String,
        "social" : Schema.Types.Mixed
    });

    UserSchema.pre("save", function (callback) {
        var user = this;
        if (!user.isModified("password")) {
            return callback();
        }
        bcrypt.genSalt(5, function (err, salt) {
            if (err) {
                return callback(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return callback(err);
                }
                user.password = hash;
                callback();
            });
        });
    });

    UserSchema.methods.verifyPassword = function (password, cb) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };

    var RaidSchema = new Schema({
        "platform" : String,
        "game" : String,
        "strength" : { "type" : Number, "min" : 3 },
        "players" : [{ "type" : Schema.Types.ObjectId, "ref" : "User" }],
        "queue" : [{ "type" : Schema.Types.ObjectId, "ref" : "User" }],
        "time_created" : Date,
        "play_time" : Date,
        "access" : String,
        "host" : { "type" : Schema.Types.ObjectId, "ref" : "User" },
        "description" : String
    });

    var FilterSchema = new Schema({
        "game" : [String],
        "platform" : [String],
        "access" : [String]
    });

    var WebEventSchema = new Schema({
        "time" : Date,
        "url" : String,
        "session_id" : String,
        "user_agent" : String,
        "referer" : String,
        "with_auth_token" : Boolean,
        "is_authenticated" : Boolean
    });

    return {
        "User" : mongoose.model("User", UserSchema),
        "Raid" : mongoose.model("Raid", RaidSchema),
        "Filter" : mongoose.model("Filter", FilterSchema),
        "WebEvent" : mongoose.model("WebEvent", WebEventSchema)
    };

}
