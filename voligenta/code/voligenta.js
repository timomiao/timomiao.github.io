/*jslint browser: true*/
/*global $, jQuery, console*/
/*global download, createClickHtml*/
/*global dictionaries, initDictionary*/
/*global freqInterfaces, print*/

/*global reduceScanResults, genSearchTree*/
/*global genResultsTable, genHtmlTable, genStatsHtmlTable, genTableRowsFromDictIndeces*/
/*global getUnknownWords, getUnknownHtml*/
/*global getSentences*/
/*global isArray*/
/*global print*/
/*global removeSectionsFromStr*/
/*global genSentWithVocsHtml*/

var istr = '';
var scanResults = [];

var currDictKey = "cedict";
var currentFreq = "hsk";

var voli = (function () {
    "use strict";
    var dbg = true,
        input = { text: '' },
        scanResults = [],
        voli = {};
              
    voli.setInputString = function (istr) { input.text = istr; };
    voli.getInputString = function () { return input.text; };

    voli.setScanResults = function (scanResIn) { scanResults = scanResIn; };
    voli.getScanResults = function () { return scanResults; };
    
    return voli;
}());


(function (voli, dicts) {
    "use strict";
    var dbg = true;
    
    voli.getCurrentDict = function () {
        var currdict_key = voli.getConfig("currDictKey");
        return dictionaries[currdict_key];
    };
        
    voli.getCurrentDictWords = function () {
        var currdict = voli.getCurrentDict();
        if (currdict.hasOwnProperty("words")) { return currdict.words; }
    };
    
    return voli;
}(voli, dictionaries));




$(document).ready(function () {
    "use strict";
	var dbg = true,
        key;
     
	print("Page ready!", dbg);
    
    voli.setCurrentDictKey("cedict");
    voli.setCurrentFreqKey("hsk");
    
    
	for (key in freqInterfaces) {
        if (freqInterfaces.hasOwnProperty(key)) {
            freqInterfaces[key].init();
        }
    }

	$("#genvoclistbutton").click(function (event) {
        var dbg = true,
            dict = dictionaries[currDictKey],
            colTitles = dict.colTitles,
            colOfSearchWords = dict.colOfSearchWords || 0,
            cols = dict.words[0].length,
            outputCols = [],
            i,
            occAndRedScanResults,
            occurences,
            redScanResults,
            postproc,
            resTable,
            resHtmlTable,
            statsHtmlTable,
            unknownWords,
            unknownHtmlTable,
            //sentences,
            sentWithVocsHtml;
        
        
		istr = $("#textarea").val();
        voli.setInputString(istr);
        
        print("scan: " + istr, dbg);

		for (i = 1; i < cols; i += 1) { outputCols.push(i); }
        voli.setCurrentOutputCols(outputCols);
        
		print("scan dict[" + currDictKey + "][words] (len:" + cols + ")", dbg);
		print("outputCols:[" + outputCols + "]", dbg);

		/* 
			scanResults contains arrays of indeces of dict wordlist 
			that were found (chronologically) :
            [ {"leaf":[idx1, idx2, ..],"offset":<INT> ,"len": <INT>}, ...]
			-> multiple indeces indicate multiple lines
            in dictionary with identical search word

			(e.g. identical simplified chinese characters 
				but different traditional characters when search for simplified word)
		*/
		scanResults = voli.scanString(istr, dict.sTree);
		print("Scan results:" + JSON.stringify(voli.getSearchResults()), dbg);

		/* remove multiple occurences (row numbers of "words"), save in separate array:
            redScanResults: [[idx1, idx2, ...], [idx1, ...], ... ]        
        */
		occAndRedScanResults = reduceScanResults(scanResults);
        occurences = occAndRedScanResults[0];
        redScanResults = occAndRedScanResults[1];
                
		print("reduced scan results:" + JSON.stringify(redScanResults), dbg);
		print("occurences:" + JSON.stringify(occurences), dbg);

        /* set postprocessor if given for applying string manipulation before output */
		postproc = null;
        if (dict.hasOwnProperty("postprocessor")) { postproc = dict.postprocessor; }

        
        /*  create table as string matrix based on reduced scan results
            results Table:
        [ [col0, col1, col2, ...], [col0, col1, col2, ...] ... ]
        */
		resTable = genResultsTable(redScanResults, dict.words, outputCols, postproc);
		print("results table:" + JSON.stringify(resTable, null, 2), dbg);

        /* create Table with set column titles */
		resHtmlTable = genHtmlTable(resTable, colTitles, outputCols);
		$("#outputtablecont").html(resHtmlTable);

        
		statsHtmlTable = genStatsHtmlTable(istr, scanResults, redScanResults, occurences);
		$("#statstablecont").html(statsHtmlTable);

        sentWithVocsHtml = genSentWithVocsHtml(istr, scanResults, outputCols, postproc);
        $("#sentencesWithVocs").html(sentWithVocsHtml);
        
		unknownWords = getUnknownWords(istr, scanResults);
		print("Unknown words:" + JSON.stringify(unknownWords, null, 2), dbg);

		unknownHtmlTable = getUnknownHtml(istr, unknownWords);
		$("#unknownsTable").html(unknownHtmlTable);
	});



	$("#downloadSTree").click(function (event) {
		download(currDictKey + "-sTree", 'dictionaries["' + currDictKey + '"]["sTree"] = ' + JSON.stringify(dictionaries[currDictKey].sTree, null, 2) + ";", dbg);
	});
	$("#downloadClickHtml").click(function (event) {
		download("clickHtml.html", createClickHtml(istr, scanResults, dictionaries[currDictKey]));
	});

    
	$.each(dictionaries, function (key, value) {
        initDictionary(key, value);
    });
         
    
});

var getWordFromDict = function (row, col) {
    "use strict";
    return dictionaries[currDictKey].words[row][col];
};

var getWordsFromDict = function (rows, col) {
    "use strict";
    var i,
        tmp = [];
    
    for (i = 0; i < rows.length; i += 1) {
        tmp.push(getWordFromDict(rows[i], col));
    }
    
    return tmp.join(',');
};

/* istr:            input string
    scanResults:    Array of Hashs {"leaf":[<INT>, ..], "offset": <INT>, "len": <INT>}
    resTable:       Array of table rows: [<INT>, ...]
*/
var genSentWithVocsHtml = function (istr, scanResults, outputCols, postproc) {
    "use strict";
    var dbg = true,
        dict = dictionaries[currDictKey],
        sentences,
        ostr = "",
        currsent,
        currsentend,
        currsenttrimmed,
        sentidx,
        scanres,
        resgroup = [],
        i,
        residx,
        histHash = {}; //store already pushed leafs (first entry)
    
        
    print("genSentWitchVocs:", dbg);
    
    sentences = getSentences(istr, dict.sentenceend);
	print("sentences:" + JSON.stringify(sentences, null, 1) + "]", dbg);
    print("scanResults:" + JSON.stringify(scanResults, null, 1), dbg);

    
    residx = 0;
    resgroup = [];
    
    for (sentidx = 0; sentidx < sentences.length; sentidx += 1) {
        currsent = sentences[sentidx];
        currsentend = currsent.offset + currsent.length - 1;
        ostr += currsent.trimmed + dict.sentenceend;

        do {
            scanres = scanResults[residx];
            
            /* use first row index as marker to look if scanres is unique */
            if ((scanres) && (!histHash.hasOwnProperty(scanres.leaf[0]))) {
                print("-> Adding words[" + scanres.leaf + "] (" + getWordsFromDict(scanres.leaf, 1) + ") to results group", dbg);
                resgroup = resgroup.concat(scanres.leaf);
                histHash[scanres.leaf[0]] = 1;
            } else {
                if (scanres) {
                    print("<- Row " + scanres.leaf[0] + " already present in histHash lists", dbg);
                }
            }
            residx += 1;
        
            print("End of while loop:", dbg);
            print("residx = [" + residx + "] <? scanResults.length = [" + scanResults.length + "]", dbg);
            if (residx < scanResults.length) {
                print("scanResults[residx].offset=[" + scanResults[residx].offset + "] <= sentend=[" + currsentend + "] ?", dbg);
            }
        } while (residx < scanResults.length &&
                 (scanResults[residx].offset <= currsentend));
        
        
        print("Sent[" + sentidx + "] finished -> resgroup:" + JSON.stringify(resgroup, null, 1), dbg);
        
        if ((resgroup.length > 5) || (sentidx === sentences.length - 1)) {
            ostr += '<table style="width:100%">';
            ostr += genTableRowsFromDictIndeces(resgroup, dictionaries[currDictKey].words, outputCols, postproc, ["4em", "4em", "8em"]);
            ostr += '</table><br>\n';
            resgroup = [];
        }
    }
    
    print("genSentWichVocsHtml end result:[" + ostr + "]", dbg);
    return ostr;
};


/*  check consistency of field lengths
    create sTree if it doesn't exist yet
*/
var initDictionary = function (key, value) {
    "use strict";
    var dbg = true,
        dictsize = dictionaries[key].words.length,
        fields = dictionaries[key].words[0].length,
        i,
        templen,
        colOfSearchWords;

    print("addDictionaries: dictionaries[" + key + "]: size:[" + dictsize + "] field length:[" + fields + "]", dbg);

    for (i = 0; i < dictsize; i += 1) {
        templen = dictionaries[key].words[i].length;
        if (templen !== fields) {
            print("Warning! " + key + "[" + i + "] has length " + templen + " instead of " + fields + "!", "warning");
        }
    }
    if (!dictionaries[key].hasOwnProperty("sTree")) {
    
    //    print("No sTree found for dictionary[" + key + "]", dbg);

        colOfSearchWords = 0;

        if (dictionaries[key].hasOwnProperty("colOfSearchWords")) {
            colOfSearchWords = dictionaries[key].colOfSearchWords;
        }

        //print("Using column [" + colOfSearchWords + "] of dictionary[" + key + "] for sTree", dbg);
        dictionaries[key].sTree = genSearchTree(dictionaries[key].words, colOfSearchWords);
        print("Generating sTree for dictionary[" + key + "] completed", dbg);
    } else {
        print("Dictionary[" + key + "][sTree] found. Using that.", dbg);
    }
};

/* eliminates multiple scan results, saves in occ(urences) dict and returns that */
var reduceScanResults = function (sres) {
    "use strict";
	var occ = {},
        newsres = [],
        i,
        representing_word;

	for (i = 0; i < sres.length; i += 1) {
		representing_word = sres[i].leaf[0];
		if (occ.hasOwnProperty(representing_word)) {
			occ[representing_word] += 1;
		} else {
			occ[representing_word] = 1;
			newsres.push(sres[i].leaf);
		}
	}
	return [occ, newsres];
};

var getUnknownWords = function (istr, scanResults) {
    "use strict";
	var dbg = false,
        offset,
        idx,
        len,
        unknown = [],
        known = [],
        interval = [],
        i;
    
	for (i = 0; i < scanResults.length; i += 1) {
		offset = scanResults[i].offset;
		len = scanResults[i].len;
		interval = [offset, offset + len - 1];
		known.push(interval);
	}
	print("known areas:" + JSON.stringify(known, null, 2), dbg);
	unknown = removeSectionsFromStr(istr, known);
	return unknown;
};

/*
		scanResults: list of matched words based on dictionary
		output:
		{
		"foundW": fWordsList,             List of matched words (non-unique)
		"foundW_len": wordslength,        Total length of words in said list
		"foundWU" : fWordsListU,          List of matched words (unique)
		"foundWU_len": wordslengthU       Total length of words in said list
		}
*/
var getListsOfFoundWords = function (scanResults) {
    "use strict";
    var dbg = false,
        dict = dictionaries[currDictKey],
        colOfSearchWords = dict.colOfSearchWords || 0,
        fWordsList = [],
        wordslength = 0,
        fWordsListU = [],
        wordslengthU = 0, //unique list
        tempdic = {},
        i,
        leaf,
        word,
        arrayCorrespondingToLeaf,
        output;


	for (i = 0; i < scanResults.length; i += 1) {
		leaf = scanResults[i].leaf;
		print("scanResults[" + i + "]:[" + scanResults[i] + "]");
		print("adding leaf[" + leaf + "]");
		
		//take any of the leaf components
		//take any of the corresponding words
		arrayCorrespondingToLeaf = dict.words[leaf[0]];
		if (isArray(colOfSearchWords)) {
			word = arrayCorrespondingToLeaf[colOfSearchWords[0]];
		} else {
			word = arrayCorrespondingToLeaf[colOfSearchWords];
		}

		print("adding length of " + word, dbg);
		fWordsList.push(word);
		wordslength += word.length;

		//for unique list
		if (!tempdic.hasOwnProperty(word)) {
			tempdic[word] = 1;
			fWordsListU.push(word);
			wordslengthU += word.length;
		}
	}
	output = {
        "foundW": fWordsList,
		"foundW_len": wordslength,
		"foundWU" : fWordsListU,
		"foundWU_len": wordslengthU
	};

	return output;
};
 


var getSentences = function (istr, sentencedivider) {
    "use strict";
    var sentences = [],
        temp = istr.split(sentencedivider),
        tempWithoutSpaces,
        dbg = false,
        i;
    
    for (i = 0; i < temp.length; i += 1) {
        tempWithoutSpaces = temp[i].replace(/\s/g, "");
        print("trimmed sentence[" + i + "]=" + tempWithoutSpaces + " length=" + tempWithoutSpaces.length, dbg);
        
        if (tempWithoutSpaces.length > 0) {
            sentences.push({
                "offset": istr.indexOf(temp[i]),
                "length": temp[i].length,
                "trimmed": tempWithoutSpaces
            });
        }
    }
    return sentences;
};
