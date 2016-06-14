/*globals print*/
/*globals genTableRow*/
/*globals getUnicodeWords*/
/*globals getListsOfFoundWords*/
/*globals currentFreq*/
/*globals genFreqTable*/


/*
	idxlist:       array of array indeces of wordarrays that should be added [[],[],..]
    wordarrays:    "words" rows from dictionary      
    collist:       array of selected columns indeces
	postproc:      <null> or function to postprocess strings (substitute, remove,...)

	otable:        table: [ ["a11","a12",.."a1m"], ["a21",...],..,["an1",..]]
*/
var genResultsTable = function (idxlist, wordarrays, collist, postproc) {
    "use strict";
	
	var dbg = false,
        otable = [],
        oline = [],
        iline = [],
        i,
        j,
        multDictEntries,
        addStr;
    
    if (postproc !== null) { print("postproc given!", dbg); }
    
	for (i = 0; i < idxlist.length; i += 1) {
		print("selecting word[" + idxlist[i] + "]", dbg);

		for (multDictEntries = 0; multDictEntries < idxlist[i].length; multDictEntries += 1) {
            
			iline = wordarrays[idxlist[i][multDictEntries]];
		
			/*create output line by pushing relevant columns*/
			for (j = 0; j < collist.length; j += 1) {
				addStr = iline[collist[j]];
				if (postproc !== null) { addStr = postproc(addStr); }
				oline.push(addStr);
			}
			otable.push(oline);
			oline = [];
		}
	}
    print("genResultsTable: finished table:" + JSON.stringify(otable, null, 1), dbg);
	return otable;
};

/*
    Generate Table rows from idxArr
    
    idxArr:     [ <INT>, <INT>, .. <INT> ]  with row numbers
    dictWordsArr:   [ ["word", .., "meaning"], ...]
    outputCols: array of column indeces that should be in output
    
    ostr:       HTML-table rows: "<tr><td></td><td>... </td></tr><tr>..."
*/
var genTableRowsFromDictIndeces = function (idxArr, dictWordsArr, outputCols, postproc, widths) {
    "use strict";
	var dbg = false,
        rowStrs = [],
        ostr = "",
        i;
    print("genTableRowsFromDictIndeces: idxArr:" + JSON.stringify(idxArr, null, 1), dbg);
    print("genTableRowsFromDictIndeces: dictWordsArr.length:" + dictWordsArr.length, dbg);
    
	for (i = 0; i < idxArr.length; i += 1) {
		rowStrs = dictWordsArr[idxArr[i]];
		print("adding row:" + JSON.stringify(rowStrs, null, 1), dbg);
        ostr += genTableRow(rowStrs, outputCols, postproc, widths);//, ["4em","4em","6em"] );
	}
	return ostr;
};

/* 
    Generate one html table row from string array
    
    arr:  ["string0", "string1", .. , "stringn"]
    
    postproc:   [optional post processor]
    widths:     [optional widths]
    
    ostr: '<tr><td>... </td><tr>'
*/
var genTableRow = function (arr, outputCols, postproc, widths) {
    "use strict";
	var dbg = false,
        str,
        ostr = '<tr>',
        i;
    
    print("genTableRow: arr:" + JSON.stringify(arr, null, 1), dbg);
    
	for (i = 0; i < arr.length; i += 1) {
        if ((!outputCols) || (outputCols.indexOf(i) !== -1)) {
            ostr += '<td';
            if (widths && (widths.length > i)) {
                ostr += " style='width:" + widths[i] + "'";
            }
            str = arr[i];
            if (postproc) { str = postproc(str); }
            ostr += '>' + str + '</td>';
        }
	}
	ostr += '</tr>';
	return ostr;
};

var genTableRowStartHeader = function (arr) {
    "use strict";
	var ostr = '<tr>',
        i;
    
	ostr += '<th scope="row">' + arr[0] + '</th>';
	for (i = 1; i < arr.length; i += 1) {
        ostr += '<td class="data">' + arr[i] + '</td>';
	}
	ostr += '</tr>';
	return ostr;
};

var genTableHeader = function (titlesarr, outputCols) {
    "use strict";
	var ostr = '<thead><tr>',
        i;
    
	for (i = 0; i < titlesarr.length; i += 1) {
        if ((!outputCols) || (outputCols.indexOf(i) !== -1)) {
            ostr += '<th scope="col">' + titlesarr[i] + '</th>';
        }
	}
	ostr += '</tr></thead><tbody>';
	return ostr;
};

/*
    Create HTML table with (mxn) table matrix and given column titles
    
    resTable: [[a11, a12, .. , a1m], [a21, a22, .. , a2m], .. [an1, an2, .. , anm]]
    
    [optional]
    colTitles: ["coltitle0", .. "coltitlem"]
*/
var genHtmlTable = function (resTable, colTitles, outputCols) {
    "use strict";
	var dbg = false,
        ostr = '<table id="restable"><thead><tr>',
        i,
        j;
    
    if (colTitles) {
        for (i = 0; i < colTitles.length; i += 1) {
            if (outputCols.indexOf(i) !== -1) {
                ostr += '<th scope="col" id="restableH' + i + '">' + colTitles[i] + '</th>';
            }
        }
        ostr += '</tr></thead>';
    }
        
    ostr += '<tbody>';

	for (i = 0; i < resTable.length; i += 1) {
		ostr += '<tr>';
		print("line[" + i + "]: " + resTable[i], dbg);

		//genTableRowsFromDictIndeces( diffEntries, dict["words"] )
		for (j = 0; j < resTable[i].length; j += 1) {
			print("otable output restable[" + i + "][" + j + "] = [" + resTable[i][j] + "]", dbg);
			ostr += '<td>' + resTable[i][j] + '</td>';
		}
		ostr += '</tr>';
	}
	ostr += '</tbody></table>';

	return ostr;
};



var genStatsHtmlTable = function (istr, scanResults, redScanResults, occurences) {
    "use strict";
	var dbg = true,
        justUnicodeWordsList = getUnicodeWords(istr),
        trimmedTotalLength = 0,
        i,
        wlists,
        ostr;
        
	print("genStatsHtmlTable: istr:[" + istr + "]", dbg);
	
	for (i = 0; i < justUnicodeWordsList.length; i += 1) {
		trimmedTotalLength += justUnicodeWordsList[i].length;
	}

	print("genStatsHtmlTable: trimmedTotalLength:[" + trimmedTotalLength + "]", dbg);

	wlists = getListsOfFoundWords(scanResults);
	/* "foundW":       list of found words
        "foundW_len":   total length of these words
        "foundWU":      unique list of found words
		"foundWU_len":    length of that	*/

	ostr = '<table id="inputStats" class="stats">';
	ostr += genTableHeader(["Characters", "total", "Unicode characters"]);
	ostr += genTableRowStartHeader(["Input", istr.length, trimmedTotalLength]);
	ostr += '</tbody></table><p></p>';

	ostr += '<table id="wordStats" class="stats">';
	ostr += genTableHeader(["Found words", "total", "unique"]);
	ostr += genTableRowStartHeader(
        ["Found words count", scanResults.length, redScanResults.length]
    );
	ostr += genTableRowStartHeader(
        ["Found words length", wlists.foundW_len, wlists.foundWU_len]
    );
	ostr += '</tbody></table><p></p>';

	ostr += '<table id="wordStats" class="stats">';
	ostr += genTableHeader(
        ["Found words length", "full input coverage", "net input coverage"]
    );
	ostr += genTableRowStartHeader([
        "total length of words found",
        Math.round(wlists.foundW_len * 100 / istr.length) + "%",
        Math.round(wlists.foundW_len * 100 / trimmedTotalLength) + "%"]);
	ostr += '</tbody></table><p></p>';

	if (currentFreq) { ostr += genFreqTable(wlists); }
	return ostr;
};
