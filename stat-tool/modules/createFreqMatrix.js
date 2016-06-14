/*globals $, console, alert*/
/*globals logger, jStat, statTool*/
/*jslint plusplus: true*/



(function (statTool) {
    "use strict";
    var cfn = 'createFreqMatrix.js',
        freq;

    statTool.freq = {
        xi: [],
        hi: [],
        Hi: [],
        fi: [],
        Fi: []
    };
    freq = statTool.freq;

    statTool.createFreqMatrix = function (lf_data) {
        var omat = [],
            prec = 4,
            size = lf_data.length,
            curr,
            idx,
            row = [],
            xi = freq.xi,
            hi = freq.hi,
            Hi = freq.Hi,
            fi = freq.fi,
            Fi = freq.Fi,
            i,
            j,
            len,
            data_left,
            data_right,
            data_middle,
            str;

        xi = [];
        hi = [];
        Hi = [];
        fi = [];
        Fi = [];

        lf_data.sort(function (a, b) {
            return (a - b);
        });
        logger.log(cfn, 'info', 'sorted data:' + lf_data);
        // $("#sorteddata").html('<span style="text-color:red"></span>');
        //   $("#sorteddata").html('<span style="color:#F00">test</span>' + lf_data.join(','));

        len = lf_data.length;

        if (len % 2 === 1) {
            data_left = lf_data.slice(0, Math.floor(len / 2));
            data_right = lf_data.slice(Math.ceil(len / 2));
            data_middle = [lf_data[Math.floor(len / 2)]];
        } else {
            data_left = lf_data.slice(0, Math.floor(len / 2) - 1);
            data_right = lf_data.slice(Math.ceil(len / 2) + 1);
            data_middle = [lf_data[Math.floor(len / 2) - 1], lf_data[Math.floor(len / 2)]];
        }

        str = data_left.join(',');
        str = str + ',<span style="color:#F00">' + data_middle.join(',') + '</span>,';
        str = str + data_right.join(',');
        $("#sorteddata").html(str);


        for (i = 0; i < size; i = i + 1) {
            curr = lf_data[i];
            idx = xi.indexOf(curr);
            if (idx === -1) {
                hi[xi.length] = 1;
                xi.push(curr);
            } else {
                hi[idx] = hi[idx] + 1;
            }
        }

        Hi[0] = hi[0];
        fi[0] = (hi[0] / size).toFixed(prec);
        Fi[0] = fi[0];

        for (i = 1; i < xi.length; i = i + 1) {
            fi[i] = hi[i] / size;
            Hi[i] = Hi[i - 1] + hi[i];
            Fi[i] = parseFloat(Fi[i - 1]) + fi[i];
        }

        for (i = 1; i < xi.length; i = i + 1) {
            fi[i] = parseFloat(fi[i]).toFixed(prec);
            Fi[i] = parseFloat(Fi[i]).toFixed(prec);
        }

        logger.log(cfn, 'info', 'xi[' + xi + ']');
        logger.log(cfn, 'info', 'hi[' + hi + ']');
        logger.log(cfn, 'info', 'Hi[' + Hi + ']');
        logger.log(cfn, 'info', 'fi[' + fi + ']');
        logger.log(cfn, 'info', 'Fi[' + Fi + ']');

        freq.xi = xi;
        freq.hi = hi;
        freq.Hi = Hi;
        freq.fi = fi;
        freq.Fi = Fi;

        for (i = 0; i < xi.length; i = i + 1) {
            row.push(i + 1);
            row.push(xi[i]);
            row.push(hi[i]);
            row.push(Hi[i]);
            row.push(fi[i]);
            row.push(Fi[i]);
            omat.push(row);
            row = [];
        }
        return omat;

    };



    return statTool;
}(statTool));
