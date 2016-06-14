/*globals print, console*/
/*globals voli*/
/*jslint plusplus: true*/

(function (voli) {
    "use strict";
    var dbg = true,
        isArray,
        results;

    isArray = function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') { return true; }
        return false;
    };

    /*
	istr: input string
	tree:	search tree

	scans for longest non-overlapping strings 

	by marking longest found substring from left and start 
	new scan right after that
    */
    voli.scanString = function (istr, tree) {
        var dbg = false,
            found_leaf = false,
            tpointer = tree,
            i = 0,
            lefti = 0,
            runs = 0,
            level = 0;
        
        results = [];

        if (istr.length === 0) { return results; }

        do {
            print("checking char[" + i + "]=[" + istr[i] + "] (lefti=" + lefti + ")", dbg);
            if (tpointer.hasOwnProperty(istr[i])) {
                //follow tree and mark biggest found subwords from left with leaf (= line of wordlist )
                print(istr[i] + " found in sTree (lefti=" + lefti + ")", dbg);
                tpointer = tpointer[istr[i]];
                level += 1;
                if (tpointer.hasOwnProperty("lf")) {
                    found_leaf = tpointer.lf; /*found leaf is array*/
                    lefti = i;
                    print("left sub word(s) found -> line:[" + tpointer.lf + "]: set lefti=" + lefti, dbg);
                }
            } else {
                //now it's not (anymore) in tree
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

    voli.getSearchResults = function () {
        return results;
    };
    
    return voli;
}(voli));