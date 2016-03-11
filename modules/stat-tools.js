/*globals $, console, alert*/
/*globals logger, jStat, statTool*/
/*jslint plusplus: true*/

var cfn = 'stat-tools.js';
logger.setLevel('info');

$(window).resize(function () {
    "use strict";
    logger.log(cfn, 'info', 'resize event');
    statTool.update();
});

$(document).ready(function () {
    "use strict";
    logger.log(cfn, 'info', 'document.ready');
    statTool.update();

    $("#data").bind("change", function (e, ui) {
        logger.log(cfn, 'info', 'change event');
        statTool.update(e, ui);
    });
});
