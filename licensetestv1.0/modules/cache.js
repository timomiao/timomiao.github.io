LTest.prototype.qObjCache = function () {
    
    
    //pre-cache the next ten questions according to idxarray
    var precachesize = 10;
    //highest pre-cached idxarray-idx
    var precachedmaxidx = 0;

    this.cachesize = 1500;
    this.cache = [];

    this.init = function () {
	console.log('init cache');
	for ( var i = 0; i < this.cachesize ; i++ ) { this.cache[i] = 0; }
    }
    this.init();

//---------- methods ---------------------

    this.resetprecache = function () {
	console.log('cache.resetprecache');
	precachedmaxidx = 0;
    }

    this.queryServer = function (idx, asyncmode) {
	var queryurl = "./py/servequestion.py";
	var querystr = "qindex="+idx;

	$.ajax( { 
	    type: "GET", 
	    url: queryurl+'?'+querystr,
	    async: asyncmode,
	    dataType: "json",
	    success: this.receivesuccess 
	});
    }
    
    // store received question-obj in cache
    this.receivesuccess = function( data ) {
	var idx  = data['idx'];
	var qobj = data['question'];
	//console.log('saving idx='+idx+' in cache');
	LTo.qcache.cache[ +idx ] = qobj;
    }
   
    // get-wrapper
    // if it's not in cache,execute synchrone server-query
    // if currentidx of idxarray is over a certain threshold,
    // populate asychrone the fields for the future questions
    this.get = function ( idx, idxarray ) {   
	var curridx = idxarray.currentidx;
	var arrlen = idxarray.length();
	
	if ( this.cache[ idx ] == 0 ) {
	    //cache miss
	    //console.log('CACHE MISS: populate cache entry '+idx);
	    this.queryServer(idx, false); // async off
	}

	if( precachedmaxidx - curridx <= precachesize/2 ) {  //do precaching
	    var newprecachedmaxidx = precachedmaxidx + precachesize/2;
	    if (newprecachedmaxidx >= arrlen -1 ) { newprecachedmaxidx = arrlen -1; }

	    var startidx = precachedmaxidx +1;
	    var endidx = newprecachedmaxidx;

	    //console.log('precaching idxs ['+ startidx +',...,'+ endidx+']');
	    var idxarrayelem = 0;

	    for ( var i = startidx; i < arrlen && i <= endidx; i++ ) {
		idxarrayelem = idxarray.array[i];

		if ( this.cache[ idxarrayelem ] == 0 )
		{
		    //console.log('CACHE MISS: populate cache entry '+idxarrayelem);
		    this.cache[ idxarrayelem ] = this.queryServer( idxarrayelem,true );
		}
	    }
	    precachedmaxidx = newprecachedmaxidx;
	}
    
	return this.cache[idx];
    }
    return this;
}
