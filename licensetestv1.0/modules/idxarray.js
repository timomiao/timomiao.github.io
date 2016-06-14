
LTest.prototype.idxarrayClass = function() {

    this.currentidx=0;
    this.array=[];

    this.getIdx = function () { return this.currentidx; } 
    this.getElement = function () { return this.array[this.currentidx]; }
    this.length = function () { return this.array.length; }
    this.next = function(){ this.currentidx+=1; return this.array[this.currentidx]; }
    this.setArray = function (a) { this.currentidx=0; this.array=a; }
    this.resetIdx = function () { this.currentidx=0; }
    this.last = function () {
	if(this.currentidx==(this.array.length-1)) {return true}
	return false;
    }

    //input: licensetype (according to var ratios object
    //output: array of catalogue-indeces (sorted)
    this.createTestArray = function(category) {
	this.setArray([]);
	var subsample = [];
	var samplesize = 0;
	var diced = {};
	var count = 0;
	var rats = testdata.ratios[category];
	for (var i = 1; i<rats.length; i++) {
	    if (rats[i]==0) {continue}
	    samplesize = rats[i];
	    startidx = testdata.sectionOffSets[i-1];
	    endidx = testdata.sectionOffSets[i]-1;
	    diff = endidx-startidx;

	    count = 0;
	    subsample = [];
	    while(count<samplesize) {
		do {rand = Math.round(Math.random()*diff)+ startidx;}
		while(diced[rand]);
		diced[rand] = 1;
		count++;
		subsample.push(rand);
	    }
	    this.array = this.array.concat(subsample.sort(function(a,b){return a-b}));
	}
    }

    this.createFullTestArray = function(category) {
	this.setArray([]);
	var ranges = testdata.categoryRanges[category]; // [[],[],..[]]

	for( var i in ranges ){
	    console.log("create testarray ["+ranges[i][0]+","+ranges[i][1]+"]");
	    for( var j = ranges[i][0]; j <= ranges[i][1]; j++)
	    {   this.array.push( j ); }
	}
    }
}

