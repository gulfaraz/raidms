module.exports = function () {
    return {
        'except' : function (object, arguments) {
            for(var i = 0, j = arguments.length; i < j; i++) {
                if(object.hasOwnProperty(arguments[i])) {
                    delete object[arguments[i]];
                }
            }
            return object;
        },
        'validateEmail' : function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }
    };
}
