/*globals print*/
/*globals freqInterfaces*/
/*globals currentFreq*/
/*globals genTableHeader, genTableRowStartHeader*/
/* 
	input:
	wordarray:         list of words
	freqInterfaceID:   reference to function that returns frequency(-class) (e.g. HSK level)

	returns { "freqClass": number of words, ... } 
*/
var getFreqStats = function (wordarray, freqInterfaceID) {
    "use strict";
	var dbg = false,
        rest = [],
        freqCount = {},
        i,
        freqInt,
        freqIface = freqInterfaces[freqInterfaceID];
    
	print("getFreqStats: in: wordarray:[" + wordarray + "]", dbg);
	
	for (i = 0; i < wordarray.length; i += 1) {
		print("get freq of word [" + wordarray[i] + "]", dbg);
        
		freqInt = freqIface.getFreq(wordarray[i]);

		if (freqIface.isRestClass(freqInt)) {
            rest.push(wordarray[i]);
        }

		if (!freqCount.hasOwnProperty(freqInt)) { freqCount[freqInt] = 0; }
		freqCount[freqInt] += 1;
	}
	print("getFreqStats: rest elements:" + rest, dbg);
	return freqCount;
};

var genFreqTable = function (wlists) {
    "use strict";
	var dbg = false,
        freqInt = freqInterfaces[currentFreq],
        freqs = getFreqStats(wlists.foundW, currentFreq),
        freqsU = getFreqStats(wlists.foundWU, currentFreq),
        colTitles = [
            "Class",
            "Size",
            "Found(unique)",
            "Class Coverage",
            "Found(total)",
            "Matched text coverage"
        ],
        ostr,
        totalSum = 0,
        coverSum = 0,
        fRange = freqInt.getFreqClassRange(),
        fClass,
        rowStrs,
        textCoverRatio,
        coverage,
        cSize;
    
    ostr = '<table id="freqTable" class="stats">';
	ostr += genTableHeader(colTitles);

	print("freqsUL" + JSON.stringify(freqsU), dbg);

	for (fClass = fRange[0]; fClass <= fRange[1]; fClass += 1) {
		rowStrs = [];
		rowStrs.push(freqInt.getNameOfFreqClass(fClass));
		rowStrs.push(freqInt.getSizeOfFreqClass(fClass));
	
		if (freqsU[fClass]) {
            rowStrs.push(freqsU[fClass]);

			coverage = "-";
			cSize = freqInt.getSizeOfFreqClass(fClass);
			if (!isNaN(cSize)) {
                coverage = Math.round(freqsU[fClass] * 100 / cSize) + "%";
            }
			rowStrs.push(coverage);

			rowStrs.push(freqs[fClass]);
			totalSum += freqs[fClass];

			textCoverRatio = Math.round(freqs[fClass] * 100 / wlists.foundW.length);
			coverSum += textCoverRatio;
			rowStrs.push(textCoverRatio + "%");
		} else { //not in freqsU
			rowStrs = rowStrs.concat(["0", "0%", "0", "0%"]);
		}
		
		ostr += genTableRowStartHeader(rowStrs);
		rowStrs = [];
	}
	ostr += genTableRowStartHeader(["Sum:", "", "", "", totalSum, coverSum + "%"]);

	ostr += '</tbody></table>';

	return ostr;
};
