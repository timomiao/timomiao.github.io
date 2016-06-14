/*globals $, jQuery*/
/*globals print, isArray*/
/*globals addWordToSearchTree, countleafs*/
/*jslint plusplus: true*/


/* array = Array of array of strings: [["..","..",..,".."],["..",.. ],.. ]
	idx = index of each array that contains words to extract _or_ array of indeces

	returns sTree e.g.  { "h": {"e": {"l": {"l": {"o": {"lf": [leafval1, leafval2,...]}}}}}}
*/
var genSearchTree = function (array, idx) {
    "use strict";
	var dbg = false,
        sTree = {},
        i,
        j;
    
	print("genSearchTree for array elements in column(s) [" + idx + "]", dbg);
    
	for (i = 0; i < array.length; i += 1) {
		if (isArray(idx)) {
			for (j = 0; j < idx.length; j += 1) {
				addWordToSearchTree(sTree, array[i][idx[j]], i);
			}
		} else { addWordToSearchTree(sTree, array[i][idx], i); }
	}
	print("Generated tree has " + countleafs(sTree) + " leafs", dbg);
	print("Dict size: " + array.length + " words", dbg);
	return sTree;
};

/* tree: tree structure: { "h": {"e": {"l": {"l": {"o": {"lf": [leafval1, leafval2,...]}}}}}}
	word:	string to add
	leaf: content of leaf of added word
*/
var addWordToSearchTree = function (tree, word, leaf) {
    "use strict";
	var dbg = false,
        tpointer = tree,
        i;
    
	for (i = 0; i < word.length; i += 1) {
		print("Adding letter[" + word[i] + "] of word " + word, dbg);
		if (typeof tpointer[word[i]] === 'undefined') { tpointer[word[i]] = {}; }
		tpointer = tpointer[word[i]];
	}
	if (!tpointer.hasOwnProperty("lf")) { tpointer.lf = []; }

	if ($.inArray(leaf, tpointer.lf) === -1) { tpointer.lf.push(leaf); }
};

var countleafs = function (node) {
    "use strict";
	var leafs = 0,
        key;
	/* node is a leaf = array of dictionary lines of identical words */
	if (isArray(node)) { return node.length; }
	for (key in node) {
        if (node.hasOwnProperty(key)) { leafs += countleafs(node[key]); }
    }
	return leafs;
};

/*
	istr: input string
	tree:	search tree

	scans for longest non-overlapping strings 

	by marking longest found substring from left and start 
	new scan right after that
*/

var scanString = function (istr, tree) {
    "use strict";
	var dbg = false,
        results = [],
        found_leaf = false,
        tpointer = tree,
        i = 0,
        lefti = 0,
        runs = 0,
        level = 0;
    
	if (istr.length === 0) { return results; }

	do {
		print("checking char[" + i + "]=[" + istr[i] + "] (lefti=" + lefti + ")", dbg);
		if (tpointer.hasOwnProperty(istr[i])) { //follow tree and mark biggest found subwords from left with leaf (= line of wordlist )
			print(istr[i] + " found in sTree (lefti=" + lefti + ")", dbg);
			tpointer = tpointer[istr[i]];
			level += 1;
			if (tpointer.hasOwnProperty("lf")) {
				found_leaf = tpointer.lf; /*found leaf is array*/
				lefti = i;
				print("left sub word(s) found -> line:[" + tpointer.lf + "]: set lefti=" + lefti, dbg);
			}
		} else { //now it's not (anymore) in tree
			print("[" + istr[i] + "] not found in subtree level[" + level + "]", dbg);
			if (isArray(found_leaf)) {
				print("leaf exists (line[" + found_leaf + "]) <- pushing", dbg);

				results.push({
                    "leaf": found_leaf,
                    "offset": lefti - level + 1,
                    "len": level
                });
                
				found_leaf = false;
				i = lefti;
				print("new index before i++: " + i, dbg);
			} else {
				lefti += 1;
				i = lefti - 1;
				print("setting i to lefti+1 = " + i, dbg);
			}
			tpointer = tree;
			level = 0;
		}//not in subtree's root
		runs += 1;
	} while ((i++ < istr.length));// && (runs++ < 500));

	print("scan runs:" + runs, dbg);

	return results;
};
