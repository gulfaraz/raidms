module.exports = function (auth, web_config) {

    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport();

    function sendMail(to, subject, html) {
        transporter.sendMail({
            "from" : "rms@gulfaraz.com",
            "to" : to,
            "subject" : subject,
            "html" : html
        });
    }

    function sendRegistrationMail(to, token) {
        var url = web_config.scheme + "://" + web_config.domain + "/registration/" + token;
        var html = "<b>Welcome</b><br/>\
        <p>Please click the following link to complete your registration.</p>\
        <p><a href='" + url + "' title='RMS Registration'>" + url + "</a></p>";
        sendMail(to, "RMS - Registration", html);
    }

    function sendMailChangeMail(to, token) {
        var url = web_config.scheme + "://" + web_config.domain + "/mail/" + token;
        var html = "<b>Hello</b><br/>\
        <p>Please click the following link to validate your mail address.</p>\
        <p><a href='" + url + "' title='RMS Mail Change'>" + url + "</a></p>";
        sendMail(to, "RMS - Validate Mail", html);
    }

    function sendAccountTerminationMail(to, user_name) {
        var url_profile_edit = web_config.scheme + "://" + web_config.domain + "/#/user/" + user_name + "/edit";
        var url_profile = web_config.scheme + "://" + web_config.domain + "/#/user/" + user_name;
        var html = "<b>Hello</b><br/>\
        <p>As per your request, your RMS account has been scheduled for termination.</p>\
        <p>Your data will be erased from our records in 24 hours.</p>\
        <p>Any activity on your RMS account would cancel the termination process.</p>\
        <p>To manually cancel the account termination, please click on the following link and Click on 'CANCEL TERMINATION'</p>\
        <p><a href='" + url_profile_edit + "' title='RMS Termination'>" + url_profile_edit + "</a></p>\
        <p>If you have received this mail but did not initiate the account termination process,</p>\
        <p>Please change your password and send a mail to <a href='mailto:rms@gulfaraz.com?subject=Unexpected Account Termination&body=I have received an unexpected account termination notification. My profile link is - " + url_profile + "'>rms@gulfaraz.com</a> to notify us of this unexpected behaviour.</p>";
        sendMail(to, "RMS - Account Termination", html);
    }

    function sendForgotPasscodeMail(to, token) {
        var url = web_config.scheme + "://" + web_config.domain + "/#/reset/" + token;
        var html = "<b>Hello</b><br/>\
        <p>Please click the following link to set a new passcode for your RMS account.</p>\
        <p><a href='" + url + "' title='RMS Reset Passcode'>" + url + "</a></p>";
        sendMail(to, "RMS - Reset Passcode", html);
    }

    return {
        "config" : web_config,
        "except" : function (object, arguments) {
            if (object.constructor.name === "model") {
                object = object.toObject();
            }
            for(var i = 0, j = arguments.length; i < j; i++) {
                if(object.hasOwnProperty(arguments[i])) {
                    delete object[arguments[i]];
                }
            }
            return object;
        },
        "validateEmail" : function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },
        "sendRegistrationMail" : sendRegistrationMail,
        "sendMailChangeMail" : sendMailChangeMail,
        "sendAccountTerminationMail" : sendAccountTerminationMail,
        "sendForgotPasscodeMail" : sendForgotPasscodeMail
    };
}
