/*globals $, console, alert*/
/*globals logger, jStat, statTool*/
/*jslint plusplus: true*/

var cfn = 'table.js';

(function (statTool) {
    "use strict";
    statTool.createHTMLTable = function (headers, matrix) {
        var row,
            i,
            j,
            ostr = '<table class="table-type1">';

        // logger.log(cfn, 'info', JSON.stringify([headers, matrix], null, 2));

        if (matrix[0].length !== headers.length) {
            logger.log(cfn, 'error', 'createHTMLTable: invalid dimensions');
        }

        ostr = ostr + '<thead><tr>';
        for (i = 0; i < matrix[0].length; i = i + 1) {
            ostr = ostr + '<th>' + headers[i] + '</th>';
        }
        ostr = ostr + '</thead>';

        ostr = ostr + '<tbody>';
        for (i = 0; i < matrix.length; i = i + 1) {
            row = matrix[i];
            ostr = ostr + '<tr>';
            for (j = 0; j < row.length; j = j + 1) {
                ostr = ostr + '<td>' + row[j] + '</td>';
            }
            ostr = ostr + '</tr>';
        }
        ostr = ostr + '</tbody></table>';
        return ostr;
    };
    return statTool;
}(statTool));
