var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    mail: { type: String, lowercase: true },
    role: String,
    status: String,
    caption: String,
    score: Number,
    play_start: Date,
    play_end: Date,
    platforms: [Schema.Types.Mixed],
    seeking: [Schema.Types.Mixed],
    date_joined: Date,
    date_updated: Date
});

var RaidSchema = new Schema({
    platform: String,
    game: String,
    strength: { type: Number, min: 2 },
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    time_created: Date,
    play_time: Date,
    status: String,
    host: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = {'User': mongoose.model('User', UserSchema), 'Raid': mongoose.model('Raid', RaidSchema) };
