var oauth2orize = require('oauth2orize');
var models = require('./models');
var User = models.User;
var Client = models.Client;
var Token = models.Token;
var Code = models.Code;

var server = oauth2orize.createServer();

server.serializeClient(function (client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function (id, callback) {
    Client.findOne({ '_id' : id }, function (err, client) {
        if(err) {
            return callback(err);
        }
        return callback(null, client);
    });
});

server.grant(oauth2orize.grant.code(function (client, redirect_uri, user, ares, callback) {
    var code = new Code({
        'value' : uid(16),
        'client_id' : client._id,
        'redirect_uri' : redirect_uri,
        'user_id' : user._id
    });
    code.save(function (err) {
        if(err) {
            return callback(err);
        }
        callback(null, code.value);
    });
}));

server.exchange(oauth2orize.exchange.code(function (client, code, redirect_uri, callback) {
    Code.findOne({ 'value' : code }, function (err, authCode) {
        if(err) {
            return callback(err);
        }
        if(authCode === undefined) {
            return callback(null, false);
        }
        if(client._id.toString() !== authCode.client_id) {
            return callback(null, false);
        }
        if(redirect_uri !== authCode.redirect_uri) {
            return callback(null, false);
        }
        authCode.remove(function (err) {
            if(err) {
                return callback(err);
            }
            var token = new Token({
                'value' : uid(256),
                'client_id' : authCode.client_id,
                'user_id' : authCode.user_id
            });
            token.save(function (err) {
                if(err) {
                    return callback(err);
                }
                callback(null, token);
            });
        });
    });
}));

exports.authorization = [
    server.authorization(function (client_id, redirect_uri, callback) {
        Client.findOne({ 'id' : client_id }, function (err, client) {
            if(err) {
                return callback(err);
            }
            return callback(null, client, redirect_uri);
        });
    }),
    function (req, res) {
        res.render('../public/views/auth.html', { 'user' : { 'username' : 'Gulfaraz' }, 'transactionID' : req.oauth2.transactionID, 'user' : req.user, 'client' : req.oauth2.client });
    }
];

exports.decision = [
  server.decision()
];

exports.token = [
  server.token(),
  server.errorHandler()
];

function uid(len) {
    var buf = []
      , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      , charlen = chars.length;
    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
