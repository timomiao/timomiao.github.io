$(document).ready( function() {
    LTo=new LTest({lang:'en',debug:0});
    LTo.setHandlers();
    LTo.initMenu();
    LTo.initStats();
    LTo.switchModeTo('menu');
});

function LTest(options) {
    
    this.standalone = false;
    
    var urlbase = document.URL.split(':')[0];
    if( urlbase == "file" ) {
	this.standalone = true;
	if ( typeof catalogue == "undefined" ) {
	    alert('Local application but questions file is missing!');	
	}
    }
    console.log('standalone: '+this.standalone);

    var settings= { lang:'en', debug:0}
    if(options) { $.extend(settings, options) }

    this.lang = settings.lang;
    this.debug = settings.debug;
    this.mode = 'menu';
    this.category = 'Car';

    function state() {
	this.reset = function () {
	    this.hlIDstr = 0;
	    this.noofanswers = 0;
	    this.wrong = [];
	    this.clickAnywhere = false;
	    this.cpause = false;
	}
	this.reset();
    }

    this.state=new state();
    this.idxarray=new this.idxarrayClass();
    this.storage=new this.storageClass(); 
    this.qcache = new this.qObjCache();
    this.timer = new this.timerClass();
    this.getQobj = function (idx) {
	if( this.standalone ) { return catalogue[idx]; }
	else { return this.qcache.get(idx, this.idxarray); }
    }
}
