/*globals module, require, console*/

var logger = (function () {
    "use strict";
    var cfn = "logger",
        logger = {},
        levels = ['info', 'warn', 'error'],
        ofunc;

    logger.debugLevel = 'warn';

    /* puts brackets around strings */
    function br(str) {
        var ostr = '';
        if (str) {
            ostr = "[" + str + "]";
        }
        return ostr;
    }

    logger.log = function (codename, ilevel, message) {
        var s_message = br(codename) + ': ' + message;

        if (ilevel === 'always') {
            if (typeof message !== 'string') {
                message = JSON.stringify(message);
            }
            console.log(br(codename) + ': ' + message);
            return;
        }

        if (levels.indexOf(logger.debugLevel) <= levels.indexOf(ilevel)) {
            if (typeof message !== 'string') {
                message = JSON.stringify(message);
            }
            //console.log('logger: ' + s_message);
            switch (ilevel) {
                /*                case "info":
                                    ofunc = console.log;
                                    break;*/
                case "warn":
                    ofunc = console.warn(s_message);
                    break;
                case "error":
                    ofunc = console.error(s_message);
                    break;
                default:
                    ofunc = console.log(s_message);
                    break;
            }
            //ofunc(br(codename) + ilevel.toUpperCase() + ': ' + message);
        }
    };

    logger.setLevel = function (ilevel) {
        if (levels.indexOf(ilevel) > -1) {
            this.log(cfn, 'always', 'Setting logger to level ' + br(ilevel));
            this.debugLevel = ilevel;
        } else {
            logger.log(cfn, 'error', "Invalid log level " + br(ilevel));
        }
    };

    return logger;
}());
