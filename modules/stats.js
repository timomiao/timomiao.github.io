/*globals $, console, alert*/
/*globals logger, jStat*/
/*jslint plusplus: true*/

var statTool = (function () {
    "use strict";
    var mod = {},
        cfn = 'stats.js';

    mod.stats = {
        mu: '-',
        median: '-',
        modus: '-',
        geomm: '-',
        sigmasq: '-',
        sigma: '-',
        mad: '-',
        spann: '-',
        varcoeff: '-',
        datasize: '-',
        max: '-',
        min: '-'
    };

    mod.data = [];

    mod.showStats = function () {
        var keys = Object.keys(mod.stats),
            i;
        logger.log(cfn, 'info', 'showStats');
        for (i = 0; i < keys.length; i = i + 1) {
            //        logger.log(cfn, 'info', 'showStats for key[' + keys[i] + '] (val:' + stats[keys[i]] + ')');
            $("table td span#" + keys[i]).text(mod.stats[keys[i]]);
            //$('#' + keys[i]).text(stats[keys[i]]);
        }

    };

    mod.updateStats = function () {
        var stats = mod.stats,
            keys = Object.keys(stats),
            i,
            data = mod.data;

        logger.log(cfn, 'info', 'analyzing data:' + JSON.stringify(data));
        stats.mu = jStat.mean(data);
        stats.median = jStat.median(data);
        stats.modus = jStat.mode(data);
        stats.geomm = jStat.geomean(data);
        stats.sigmasq = jStat.variance(data);
        stats.sigma = jStat.stdev(data);
        stats.mad = jStat.meandev(data);
        stats.spann = jStat.range(data);
        stats.varcoeff = jStat.coeffvar(data);
        stats.datasize = data.length;
        stats.max = jStat.max(data);
        stats.min = jStat.min(data);

        for (i = 0; i < keys.length; i = i + 1) {
            // logger.log(cfn, 'info', 'typeof stats.' + keys[i] + ': ' + typeof stats[keys[i]]);
            if (typeof stats[keys[i]] === "number" && keys[i] !== "datasize") {
                //          logger.log(cfn, 'info', 'reformatting key ' + keys[i]);
                stats[keys[i]] = stats[keys[i]].toFixed(8);
            }
        }

        mod.showStats();
    };

    mod.parseText = function (id) {
        var str = $(id).val(),
            datalist = str.split(','),
            lf_data = [],
            i;
        logger.log(cfn, 'info', 'parseText:[' + JSON.stringify(datalist) + ']');
        for (i = 0; i < datalist.length; i = i + 1) {
            lf_data[i] = parseFloat(datalist[i]);

            //     logger.log(cfn, 'info', 'Check element[' + lf_data[i] + ']');
            //if (typeof lf_data[i] !== "number") {
            if (isNaN(lf_data[i])) {
                alert('parseText: Fehler: Element Nr.' + (i + 1) + ' "' + datalist[i] + '" ist ungültig');
            }

        }

        mod.data = lf_data;
        logger.log(cfn, 'info', 'parseText: mod.data:' + JSON.stringify(mod.data));
        return lf_data; //datalist;
    };


    mod.update = function (e, ui) {
        var mat;

        mod.parseText('#data');
        logger.log(cfn, 'info', 'Parsed data:' + mod.data);

        mod.updateStats();
        mod.showStats();

        mat = mod.createFreqMatrix(mod.data);
        $('#haeufigkeiten').html(mod.createHTMLTable(['i', 'xi', 'hi', 'Hi', 'fi', 'Fi'], mat));

        mod.plotDiscRelFreqDist('#plot1');
        mod.plotDiscCumRelFreqDist('#plot2');
        mod.plotBoxWhisker('#plotboxwhisker1');
        mod.plotBoxWhisker('#plotboxwhisker2');


    };
    return mod;
}());
