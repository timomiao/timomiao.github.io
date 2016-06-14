/*globals print, console*/
/*globals voli*/

(function (voli) {
    "use strict";
    var dbg = true,
        config,
        setConfig;
    
    config = {
        currDictKey: undefined,
        currFreqKey: undefined,
        currOutputCols: undefined,
        inputStr: undefined
    };
    
    setConfig = function (newconf) {
        var key,
            oldval,
            newval;
        
        if (typeof (newconf) === "object") {
            for (key in newconf) {
                if (newconf.hasOwnProperty(key)) {
                    oldval = voli.getConfig(key);
                    config[key] = newconf[key];
                    newval = voli.getConfig(key);
                    print("switch config[" + key + "]: [" + oldval + "]->[" + newval + "]", dbg);
                }
            }
        } else { console.error("setConfig: new config must be object"); }
    };
    
    /* public */
    
    voli.getConfig = function (key) {
        if (config.hasOwnProperty(key)) {
            return config[key];
        }// else { console.error("getConfig(" + key + ") but " + key + " not present!"); }
    };

    voli.getConfigStr = function () {
        return JSON.stringify(config, null, 1);
    };
    
    voli.setCurrentDictKey = function (dictkey) { setConfig({"currDictKey": dictkey}); };
    voli.getCurrentDictKey = function () { return voli.getConfig("currDictKey"); };
    
    voli.setCurrentFreqKey = function (freqkey) { setConfig({"currFreqKey": freqkey}); };
    voli.getCurrentFreqKey = function () { return voli.getConfig("currFreqKey"); };
    
    // OUTPUT COLS
    voli.setCurrentOutputCols = function (cols) { setConfig({"currOutputCols": cols}); };
    voli.getCurrentOutputCols = function () { return voli.getConfig("currOutputCols"); };
    voli.addOutputCol = function (colidx) {
        var cols = voli.getCurrentOutputCols(); //reference
        if (cols.indexOf(colidx) === -1) { cols.push(colidx); cols.sort(); }
    };
    voli.removeOutputCol = function (colidx) {
        var cols = voli.getCurrentOutputCols(),
            idx = cols.indexOf(colidx);
        if (idx) { cols.splice(idx, 1); } else {
            print("removeOutputCol(" + colidx + ") but idx not present!", dbg, "error");
        }
    };
    
    voli.setCurrentInputStr = function (istr) { setConfig({"inputStr": istr}); };
    voli.getCurrentInputStr = function (istr) { return voli.getConfig("inputStr"); };
    
    
    return voli;
}(voli));