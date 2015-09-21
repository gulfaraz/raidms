module.exports = function (config) {

    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport(config.mail);

    function sendMail(to, subject, html) {
        var mail_signature = "<p><h2><a href='" + config.web.scheme + "://" + config.web.domain + "' title='" + config.name + "'>" + config.name + "</a></h2></p>\
        <p><small>If you are unaware of the information contained in this mail, please notify me at <a href='mailto:" + config.mail.auth.user + "?subject=Unexpected Information&body=I have received an unexpected mail notification from " + config.name + " (" + config.web.domain + ") '>" + config.mail.auth.user + "</a></small></p>\
        <p><small>If you are aware of the information contained in this mail but does not relate to you, please notify me at <a href='mailto:" + config.mail.auth.user + "?subject=Unexpected Information&body=I have received an unexpected mail notification from " + config.name + " (" + config.web.domain + ") '>" + config.mail.auth.user + "</a></small></p>\
        <p><small>If you want to help or need to talk to the administrators of <a href='" + config.web.scheme + "://" + config.web.domain + "' title='" + config.name + "'>" + config.name + "</a>, please get in touch with me at <a href='mailto:" + config.mail.auth.user + "?subject=Queries/Suggestions'>" + config.mail.auth.user + "</a></small></p>";
        transporter.sendMail({
            "from" : config.mail.auth.user,
            "to" : to,
            "subject" : subject,
            "html" : html + mail_signature
        }, function (error, info) {
            if(error) {
                console.log(error);
            } else {
                console.log("Mail Sent - " + info.response);
            }
        });
    }

    function sendRegistrationMail(to, token) {
        var html = "<b><h1>Welcome to <a href='" + config.web.scheme + "://" + config.web.domain + "' title='" + config.name + "'>" + config.name + "</a>,</h1></b><br/>\
            <p><h2>A network of gamers, for gamers, by gamers.</h2></p>";
        if(token) {
            var url = config.web.scheme + "://" + config.web.domain + "/registration/" + token;
            html += "<p>Please click the following link to complete your registration.</p>\
            <p><a href='" + url + "' title='" + config.name + " - Registration'>" + url + "</a></p>";
        }
        sendMail(to, config.name + " - Registration", html);
    }

    function sendMailChangeMail(to, token) {
        var url = config.web.scheme + "://" + config.web.domain + "/mail/" + token;
        var html = "<b>Hello</b><br/>\
        <p>Please click the following link to validate your mail address.</p>\
        <p><a href='" + url + "' title='" + config.name + " - Mail Change'>" + url + "</a></p>";
        sendMail(to, config.name + " - Validate Mail", html);
    }

    function sendAccountTerminationMail(to, user_name) {
        var url_profile_edit = config.web.scheme + "://" + config.web.domain + "/#/user/" + user_name + "/edit";
        var url_profile = config.web.scheme + "://" + config.web.domain + "/#/user/" + user_name;
        var html = "<b>Hello</b><br/>\
        <p>As per your request, your " + config.name + " account has been scheduled for termination.</p>\
        <p>Your data will be erased from our records in 24 hours.</p>\
        <p>Any activity on your " + config.name + " account would cancel the termination process.</p>\
        <p>To manually cancel the account termination, please click on the following link and Click on 'CANCEL TERMINATION'</p>\
        <p><a href='" + url_profile_edit + "' title='" + config.name + " - Termination'>" + url_profile_edit + "</a></p>\
        <p>If you have received this mail but did not initiate the account termination process,</p>\
        <p>Please change your password and send a mail to <a href='mailto:rms@gulfaraz.com?subject=Unexpected Account Termination&body=I have received an unexpected account termination notification. My profile link is - " + url_profile + "'>rms@gulfaraz.com</a> to notify us of this unexpected behaviour.</p>";
        sendMail(to, config.name + " - Account Termination", html);
    }

    function sendForgotPasscodeMail(to, token) {
        var url = config.web.scheme + "://" + config.web.domain + "/#/reset/" + token;
        var html = "<b>Hello</b><br/>\
        <p>Please click the following link to set a new passcode for your " + config.name + " account.</p>\
        <p><a href='" + url + "' title='" + config.name + " - Reset Passcode'>" + url + "</a></p>";
        sendMail(to, config.name + " - Reset Passcode", html);
    }

    function sendSocialAccount(to, network, status) {
        var html = "<b>Hello</b><br/>\
        <p>A " + network + " ID has been " + (status ? "linked to" : "unlinked from") + " your " + config.name + " account.</p>";
        sendMail(to, config.name + " - Social Account", html);
    }

    return {
        "config" : config.web,
        "capitalize" : function (input) {
            return (input && input.length > 0) ? input.toString().charAt(0).toUpperCase() + input.slice(1) : input;
        },
        "except" : function (object, arguments) {
            var new_object = {};
            if (object.constructor.name === "model") {
                object = object.toObject();
            }
            for(var i = 0, keys = Object.keys(object), len = keys.length; i < len; i++) {
                if(arguments.indexOf(keys[i]) < 0) {
                    new_object[keys[i]] = object[keys[i]];
                }
            }
            return new_object;
        },
        "get_sub_property" : function (obj) {
            if(obj) {
                if (obj.constructor.name === "model") {
                    obj = obj.toObject();
                }
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0, len = args.length; i < len; i++) {
                    if (!obj || !obj.hasOwnProperty(args[i])) {
                        return false;
                    }
                    obj = obj[args[i]];
                }
            }
            return obj;
        },
        "validateEmail" : function (email) {
            var re = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
            return re.test(email);
        },
        "sendRegistrationMail" : sendRegistrationMail,
        "sendMailChangeMail" : sendMailChangeMail,
        "sendAccountTerminationMail" : sendAccountTerminationMail,
        "sendForgotPasscodeMail" : sendForgotPasscodeMail,
        "sendSocialAccount" : sendSocialAccount
    };
}
