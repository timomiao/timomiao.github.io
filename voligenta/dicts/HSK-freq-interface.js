/*globals freqInterfaces*/
/*globals print*/
/*globals dictionaries*/

freqInterfaces.hsk = {
    dbg: false,
	sHash: {},
	dicts: ["hsk1", "hsk2", "hsk3", "hsk4", "hsk5", "hsk6", "none"],
	wordCol: 0,
	init: function () {
        "use strict";
		var dbg = true,
            runs = 0,
            i,
            j,
            dictKey,
            words,
            entry;
        
        print("init freqInterfaces[hsk]", dbg);
        
		//populates sHash with words from all this.dicts with value=HSK-level: 
		// sHash= { word:hsk-level, ...}
		for (i = 0; i < this.dicts.length; i += 1) {
			dictKey = this.dicts[i];
			if (!dictionaries.hasOwnProperty(dictKey)) {
				print("freq[hsk]: dict[" + dictKey + "] not yet ready", dbg);
				//continue;
			} else {
                if (!this.isRestClass(i)) {
                    print("freq[hsk]: hashing dict[" + dictKey + "]", dbg);
                    words = dictionaries[dictKey].words;
                    for (j = 0; j < words.length; j += 1) {
                        entry = words[j][this.wordCol];

                        if (this.sHash.hasOwnProperty(entry)) {
                            print('freqInterfaces["hsk"]: entry [' + entry + '] already in HSK[' + (this.sHash[entry] + 1) + "]", dbg);
                        }
                        this.sHash[entry] = i + 1;
                        runs += 1;
                    }
                }
            }
		}
		print("init freqInterfaces[hsk] completed: hash-runs = " + runs, dbg);
	},
	//returns HSK level (or 7 if not present)
	getFreq: function (word) { //returns frequency 1 to 7
        "use strict";
		if (this.sHash.hasOwnProperty(word)) {
            print("word [" + word + "] found in freq hash, freq = " + this.sHash[word], this.dbg);
            return this.sHash[word];
        }
//		console.log('freqInterfaces["hsk"]not in HSK:['+word+']');		
		return 7;
	},
	getSizeOfFreqClass: function (freqno) {
        "use strict";
		if (freqno === 7) { return "none"; }
		return dictionaries[this.dicts[freqno - 1]].words.length;
	},
	getNameOfFreqClass: function (freqno) {
        "use strict";
		if (!this.isValidFreqClass(freqno)) { return "invalid freqno " + freqno; }
		return this.dicts[freqno - 1];
	},
	getFreqClassRange: function () {
        "use strict";
		return [1, 7];
	},
	isValidFreqClass: function (freqClass) {
        "use strict";
		var range = this.getFreqClassRange();
		if ((freqClass < range[0]) || (freqClass > range[1])) { return false; }
		return true;
	},
	isRestClass: function (freqClass) {
        "use strict";
		if (freqClass === 7) { return true; }
		return false;
	}
};

