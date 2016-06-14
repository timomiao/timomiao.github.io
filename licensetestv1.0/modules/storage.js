

LTest.prototype.storageClass = function ()
{
    var maxtotal = 0;
    var mintotal = 0;
    var useStorage = false;

    if( $.jStorage.storageAvailable() ) { useStorage = true; }
    console.log("jStorage active: "+useStorage);      
    if( ! useStorage ) return;

    var exists = function (key) { return $.jStorage.get( key, false ); }
    
    var resetStorage = function () {
	$.jStorage.flush();
	var stats = {
	    "total": 0,
	    "wrong": 0,
	    "maxtotal": 0,
	    "mintotal": 0, 
	    "meanratio": 0, 
	    "meantotal": 0
	}
	$.jStorage.set( "stats", stats);
	var temp = {};
	for ( var i = 0; i < 1500; i++)
	{
	    temp[i]={ "total":0, "wrong":0, "ratio":0 };
	}
	$.jStorage.set( "questions", temp );
	console.log("reset jstorage");
    }

    this.reset = function () {
	resetStorage();
    }

    var init = function (idx) {
	console.log("init jstorage");
	mintotal = 0;
        maxtotal = 0;
	if( exists("stats") == false ) {
	    resetStorage();
	}
    }
    init();

 
    var incTotal = function (idx) { 
        var total = $.jStorage.get("questions")[idx]["total"]; 
        $.jStorage.get("stats").total += 1;
	total += 1;
        $.jStorage.get("questions")[idx]["total"]=total; 
        if( total > maxtotal) { maxtotal = total; }
    }
   
    var incWrong = function (idx) { 
	$.jStorage.get("stats").wrong += 1;
	$.jStorage.get("questions")[idx]["wrong"] += 1; 
    }
    
    var updateRatio = function (idx) { 
        var wrong = $.jStorage.get("questions")[idx]["wrong"];
        var total = $.jStorage.get("questions")[idx]["total"];
        if( total == 0 ) {
            alert("error: jStorage(questions)["+idx+"][total]==0!");
        }
	    $.jStorage.get("questions")[idx]["ratio"] = wrong / total;
    }

    this.rightAnswer = function (idx) {
	    if( ! useStorage ) return;
	    incTotal( idx ); 
	    updateRatio( idx ); 
    }
    this.wrongAnswer = function (idx) {
	    if( ! useStorage ) return;
	    incTotal( idx ); 
	    incWrong( idx ); 
	    updateRatio( idx ); 
    }
//TODO: Check offsets (category, last index/endindex?)

   
    this.updateStats = function(category){
	console.log('update stats for cat:'+category);
	if( ! useStorage ) {
	    alert('no storage');
	    return;
	}
        var count = 0;
	var maxtotal = 0;
        var mintotal = 1000000;
	var sumoftotals = 0;
        var sumofratios = 0;
        var total = 0;
	
	var ranges = testdata.categoryRanges[category];
        for (var i in ranges) {
	    console.log("update stats on ["+ranges[i][0]+","+ranges[i][1]+"]");
	    for (var j = ranges[i][0]; j <= ranges[i][1]; j++) {
                count += 1;
		sumofratios += $.jStorage.get("questions")[j]["ratio"];
		total = $.jStorage.get("questions")[j]["total"];
		sumoftotals += total;
                if( total < mintotal ) { mintotal = total; }
		if( total > maxtotal ) { maxtotal = total; }
            }
        }

	var stats = {
	    "total" : $.jStorage.get("stats").total,
	    "wrong" : $.jStorage.get("stats").wrong,
	    "maxtotal": maxtotal,
	    "mintotal": mintotal, 
	    "meanratio": sumofratios / count, 
	    "meantotal": sumoftotals / count 
	}
	$.jStorage.set("stats",stats);
    }

    //calculate progress (0: start, 1: finished)
    //for every mintotal you earn 20%, so if every question was asked at least 5 times, oyou get full score
    //substracted by the mean ratio of the wrong answers, so if the mean
    //value is less than 5% (wrong), you get full score.
    //When both is fulfilled, the progress is completed.
    this.getProgress = function () {
	if( ! useStorage ) return;
	this.updateStats();
	var stats = $.jStorage.get("stats");
        var mintotal = stats["mintotal"];
        var meanratio = stats["meanratio"];
	var meantotal = stats["meantotal"];
        
        if(meanratio < 0.05 ) meanratio = 0;
	if(mintotal > 5 ) mintotal = 5;

	var totalpart;
	var ratiopart = meanratio;
	
	if(meantotal < mintotal) { totalpart = meantotal/5; }
	else { //mintotal=0 -> 0 //mintotal=5 -> 1
	    totalpart = mintotal/5; 
	}

        console.log("progress: totalpart="+totalpart+"   ratiopart="+ratiopart);
	var progress = totalpart - ratiopart;
	if( progress < 0 ) progress = 0;

	return progress;
    }

    this.createTestArray = function (category) {
	this.setArray([]);
	var subsample = [];
	var temp = [];
	var sampelsize = 0;
	var rats = testdata.ratios[LTo.category];
	for (var i = 1; i < rats.length; i++) {
	    if( rats[i] == 0) {continue}
	    samplesize = rats[i];

	    startidx = testdata.sectionOffSets[i-1];
	    endidx = testdata.sectionOffSets[i]-1;
	    diff = endidx - startidx;

	    for (var j = startidx; j < endidx; j++) {
		temp.push( {"name":j, "obj":$.jStorage.get( j )} );
	    }

	    //order questions stats according to the 
	    //sum of wrong-ratio + used-ratio
	    //(questions often answered wrong or less often used)
	    temp.sort( 
		    function(a,b){
			var as = a["obj"]["ratio"] + 1 - a["obj"]["total"]/maxtotal;
			var bs = b["obj"]["ratio"] + 1 - b["obj"]["total"]/maxtotal;
			return as == bs ? 0 : (as > bs ? 1 : -1);
		    } );

	    for (var j = 0; j < samplesize; j++) { subsample.push( temp[j]["name"] ); }
	    array = array.concat( subsample.sort( function(a,b){ return a-b } ));
	}
	return this;
    }
}
