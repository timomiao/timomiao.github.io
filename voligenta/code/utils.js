/*globals console*/

/*
    text:   string to print
    onoff:  on-off switch (binary)
    dbglevel:   "warning" | "error" | none
*/
var print = function (text, onoff, dbglevel) {
    "use strict";
    if (!onoff) { return; }
    
    switch (dbglevel) {
    case "warning":
        console.warn(text);
        break;
    case "error":
        console.error(text);
        break;
    default:
        console.log(text);
        break;
    }
};


var isArray = function (obj) {
    "use strict";
	if (Object.prototype.toString.call(obj) === '[object Array]') { return true; }
	return false;
};
