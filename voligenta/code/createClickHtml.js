/*globals print*/
/*globals genTableRowsFromDictIndeces*/

var createClickHtml = function (str, scanRes, dict) {
    "use strict";
	var offset,
        postproc = null,
        len,
        diffEntries,
        initTable = '<table><tbody>',
        closeTable = '</tbody></table>',
        ostr = "",
        tempOstr = "",
        leftIdx = 0,
        i;

    if (dict.hasOwnProperty("postproc")) {
        postproc = dict.postproc;
    }
	ostr = '<!DOCTYPE html public "-//W3C//DTD HTML 4.01//EN">\n<html><head><title>Clickable Html</title><meta http-equiv="Content-Type" content="text/html"; charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n<script>var tables=[';
	
	for (i = 0; i < scanRes.length; i += 1) {
		tempOstr = "";
		if (i !== 0) { tempOstr += ",\n"; }
		diffEntries = scanRes[i].leaf;
		tempOstr += '"' + initTable + genTableRowsFromDictIndeces(diffEntries, dict.words, postproc, ["4em", "4em", "5em"]) + closeTable + '"';
		ostr += tempOstr;
	}

	ostr += '];';
	ostr += 'var showDict = function(i) {var ele = document.getElementById("clickHtmlTestPopup"); ele.innerHTML=tables[i]; return true; }; </script>\n</head><body style="font-size:2em">';
	
	for (i = 0; i < scanRes.length; i += 1) {

		diffEntries = scanRes[i].leaf;
		offset = scanRes[i].offset;
		len = scanRes[i].len;
		tempOstr = str.substring(leftIdx, offset);
		tempOstr += '<span onclick="showDict(' + i + ')">';
		tempOstr += str.substring(offset, offset + len) + '</span>';
		leftIdx = offset + len;
		print("adding tempOstr:[" + tempOstr + "]");
		ostr += tempOstr;
	}
	ostr += '<div id="clickHtmlTestPopup"></div>';

	return ostr;
};

