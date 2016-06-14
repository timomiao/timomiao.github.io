/*globals $, console, alert*/
/*globals logger, jStat, statTool*/
/*jslint plusplus: true*/



(function (statTool) {
    "use strict";
    var cfn = 'plot.js',
        genFlotDataObj;

    genFlotDataObj = function (xyvec, options) {
        var obj = {
                data: xyvec,
                color: '#AAA'
            },
            optkeys,
            i;

        if (options) {
            optkeys = Object.keys(options);
            for (i = 0; i < optkeys.length; i = i + 1) {
                obj[optkeys[i]] = options[optkeys[i]];
            }
        }
        return obj;
    };

    statTool.genDiscRelFreqDistData = function () {
        var m_data = [],
            xi = statTool.freq.xi,
            fi = statTool.freq.fi,
            i;

        logger.log(cfn, 'info', 'genDiscRelFreqDistData - xi:' + xi + ' fi:' + fi);
        for (i = 0; i < xi.length; i = i + 1) {
            m_data.push(genFlotDataObj([[xi[i], 0], [xi[i], fi[i]]], {
                color: "#00F"
            }));
        }

        logger.log(cfn, 'info', 'flot data:[' + JSON.stringify(m_data) + ']');
        return m_data;
    };

    statTool.plotDiscRelFreqDist = function (id) {
        $.plot($(id), statTool.genDiscRelFreqDistData(), {
            yaxis: {
                max: parseFloat(jStat.max(statTool.freq.fi)) * 1.05
            },
            xaxis: {
                min: jStat.min(statTool.freq.xi) - 0.1,
                max: jStat.max(statTool.freq.xi) + 0.1
            }
        });
    };


    statTool.genFlotDiscCumRelFreqDistData = function () {
        var m_data = [],
            xi = statTool.freq.xi,
            Fi = statTool.freq.Fi,
            i;

        for (i = 0; i < xi.length - 1; i = i + 1) {
            m_data.push(genFlotDataObj(
                [[xi[i], parseFloat(Fi[i])], [xi[i + 1], parseFloat(Fi[i])]], {
                    color: "#00F"
                }
            ));
        }
        m_data.push(genFlotDataObj([
            [xi[xi.length - 1], parseFloat(Fi[xi.length - 1])],
            [xi[xi.length - 1] + 1, parseFloat(Fi[xi.length - 1])]], {
            color: "#00F"
        }));

        logger.log(cfn, 'info', 'flot disc cum rel freq data:[' + JSON.stringify(m_data) + ']');
        return m_data;
    };


    statTool.genFlotDiscCumRelFreqDistDataOff = function () {
        var m_data = [],
            xi = statTool.freq.xi,
            Fi = statTool.freq.Fi,
            i;
        //m_data = [[[1, 3], [2, 14.01], [3.5, 3.14]]];
        //        m_data = [[[0, 1], [1, 1], null, [1, 2], [3, 2]]];

        for (i = 0; i < xi.length - 1; i = i + 1) {
            m_data.push([xi[i], Fi[i]]);
            m_data.push([xi[i + 1], Fi[i]]);
            m_data.push(null);
        }
        m_data.push([xi[xi.length - 1], Fi[xi.length - 1]]);
        m_data.push([xi[xi.length - 1] + 1, Fi[xi.length - 1]]);

        logger.log(cfn, 'info', 'flot data:[' + JSON.stringify(m_data) + ']');
        return [m_data];
    };

    statTool.plotDiscCumRelFreqDist = function (id) {
        $.plot($(id), statTool.genFlotDiscCumRelFreqDistData(), {
            yaxis: {
                max: 1.05
            },
            xaxis: {
                min: jStat.min(statTool.freq.xi) - 0.1,
                max: jStat.max(statTool.freq.xi) + 0.5
            }
        });
    };



    statTool.genplotBoxWhiskerData = function () {
        var mat = [],
            //q = jStat.quartiles(statTool.data),
            q = jStat.quantiles(statTool.data, [0.25, 0.5, 0.75]),
            min = parseFloat(statTool.stats.min), //jStat.min(statTool.data),
            max = parseFloat(statTool.stats.max), //jStat.max(statTool.max),
            mu = parseFloat(statTool.stats.mu),
            up = parseFloat(10),
            down = parseFloat(0),
            mid = parseFloat(up - down) / 2;

        logger.log(cfn, 'info', 'Data:' + JSON.stringify(statTool.data));
        logger.log(cfn, 'info', 'Quartiles:' + JSON.stringify(q));


        mat.push(genFlotDataObj([[min, down], [min, up]]));
        mat.push(genFlotDataObj([[min, mid], [q[0], mid]]));
        mat.push(genFlotDataObj([[q[0], down], [q[0], up]]));
        mat.push(genFlotDataObj([[q[0], up], [q[2], up]]));
        mat.push(genFlotDataObj([[q[0], down], [q[2], down]]));
        mat.push(genFlotDataObj([[q[2], down], [q[2], up]]));
        mat.push(genFlotDataObj([[q[2], mid], [max, mid]]));
        mat.push(genFlotDataObj([[max, down], [max, up]]));

        mat.push(
            genFlotDataObj([[q[1], down], [q[1], up]], {
                color: '#F00'
            })
        );
        mat.push(
            genFlotDataObj([[mu, down], [mu, up]], {
                color: '#0F0',
                hoverable: true
            })
        );

        logger.log(cfn, 'info', 'BoxWhiskerMat:' + JSON.stringify(mat));
        return mat;
    };

    statTool.plotBoxWhisker = function (id) {

        $.plot($(id), statTool.genplotBoxWhiskerData(), {
            yaxis: {
                show: false
            },
            xaxis: {
                min: jStat.min(statTool.freq.xi), // - 0.1,
                max: jStat.max(statTool.freq.xi) // + 0.5
            },
            grid: {
                borderWidth: 0,
                borderColor: null,
                margin: 0
            }
        });
        /*  $(id).bind("plotclick", function (event, pos, item) {
              console.log("You clicked at " + pos.x + ", " + pos.y);

              if (item) {
                  highlight(item.series, item.datapoint);
                  alert("You clicked a point!");
              }
          });*/
    };

    return statTool;
}(statTool));
