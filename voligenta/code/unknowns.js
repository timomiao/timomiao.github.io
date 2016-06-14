/*globals print*/
/*globals getIntervalsOfUnknownWords*/
/*globals getUnicodeWords*/
/*globals XRegExp*/
/*globals genTableHeader*/

/* remove non overlapping sections from string
	sections: list of intervals: [ [left1,right1], [left2,right2], ...]

	returns left (unknown) intervals
*/
var removeSectionsFromStr = function (istr, sections) {
    "use strict";
	var dbg = false,
        left,
        right,
        offsetOfFirstWordFound,
        unknown = [],
        interval = [],
        unknownIntervals,
        i;
    
	print("Sections:" + JSON.stringify(sections, null, 1), dbg);
    print("istr.length=" + istr.length, dbg);

	if (sections.length === 0) { return []; }

	offsetOfFirstWordFound = sections[0][0];
	if (offsetOfFirstWordFound > 0) {
		left = 0;
		right = offsetOfFirstWordFound - 1;
		unknown = getIntervalsOfUnknownWords(istr, left, right);
	}
	
	for (i = 0; i < sections.length; i += 1) {
		left = sections[i][1] + 1;
		if ((i + 1) < sections.length) {
            right = sections[i + 1][0] - 1;
		} else { right = (istr.length - 1); }
	
		if (right > left) {
			interval = [left, right];
			unknownIntervals = getIntervalsOfUnknownWords(istr, left, right);
			unknown = unknown.concat(unknownIntervals);
		}
	}
	print("unknown sections:" + JSON.stringify(unknown, null, 1), dbg);
	
	return unknown;
};

/* istr:	 input string (text)
	start: offset of segment with stuff not matched by sTree
	end:	 end index (exclusive)
*/
var getIntervalsOfUnknownWords = function (istr, start, end) {
	"use strict";
    var dbg = false,
        intervalStr = istr.substring(start, end + 1),
        unknown = [],
        offset,
        interval,
        len,
        unknownUnicodeWords,
        j;
	print("getIntervalOfUnknownWords: (.., start,end):(" + start + "," + end + "):[" + intervalStr + "]", dbg);

	unknownUnicodeWords = getUnicodeWords(intervalStr);
    
	for (j = 0; j < unknownUnicodeWords.length; j += 1) {
		//stuff left and right index as interval into array of intervals of unknown words
		print("getIntervalOfUnknownWords: looking up offset of [" + unknownUnicodeWords[j] + "] startidx=" + start, dbg);
        
		offset = istr.indexOf(unknownUnicodeWords[j], start);
		len = unknownUnicodeWords[j].length;
		interval = [ offset, offset + len - 1];
		print("getIntervalOfUnknownWords: pushing interval[" + interval + "]", dbg);
		unknown.push(interval);
	}
	return unknown;
};

var getUnicodeWords = function (istr) {
    "use strict";
	var dbg = false,
        wordList = [],
        splitArray = XRegExp.split(istr, new XRegExp("[^\\pL]+")),
        idx;
        
	//somehow this always contains "" as first (and last if semgent.length>0) element
	for (idx = 0; idx < splitArray.length; idx += 1) {
		if (splitArray[idx].length > 0) {
			wordList.push(splitArray[idx]);
			print("getUnicodeWords: pushing word[" + splitArray[idx] + "]", dbg);
		}
	//	else {if(dbg) console.log("omitting non-word segment ["+splitArray[idx]+"]");	}
	}
	return wordList;
};
/* messes up syntax highlight
var notwordcomp = new RegExp(/[\!\?\\r\n\t\,\.\:\ \;\'\"\，\。\。\“\”\：\《\》\？\！\；]* /,"g");

var containsWord = function (istr) {
	var newstr = istr.replace(notwordcomp, '');
	console.log("containsWord("+istr+")-> newstr=["+newstr+"].length="+newstr.length);

	var unicodeWord = XRegExp("^\\pL+$");
	if (unicodeWord.test(istr)) {console.log("XRegExp says yes");}
	else {console.log("XRegExp says nay");}

	if( newstr.length == 0) return false;
	return true;
}
*/


var getUnknownHtml = function (istr, unknownWords) {
    "use strict";
	var dbg = false,
        ostr = '',
        arr,
        unknownWord,
        i;
    
    ostr += '<table id="unknownsTable">';
	ostr += genTableHeader(["unknown word", "meaning"]);
	ostr += '<tbody>';

	print("getUnkownHtml: istr=[" + istr + "]", dbg);
	for (i = 0; i < unknownWords.length; i += 1) {
		arr = unknownWords[i];
		print("creating entry for [" + arr + "]: left:" + arr[0] + " right:" + arr[1], dbg);
		unknownWord = istr.substring(arr[0], arr[1] + 1);
		unknownWord = unknownWord.replace("<", '&lt');
		unknownWord = unknownWord.replace(">", '&gt');
		ostr += '<tr>';
		ostr += '<td>' + unknownWord + '</td>';
		ostr += '<td>unknown</td>';
		ostr += '</tr>';
	}
	ostr += '</tbody></table>';
	print("unknown-table:" + ostr, dbg);
	return ostr;
};

