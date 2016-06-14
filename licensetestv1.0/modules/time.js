LTest.prototype.timerClass = function () {

    var initTime = new Date().getTime();
    var startTime = 0;
    var timediff = 0;
    var dbg = false;
    var timerID = 0;

    this.start = function () {
	startTime = new Date().getTime();
	timerID = setInterval( LTo.timer.updater, 1000, LTo.timer);
	//this.updater();
	if(dbg) console.log("start timer");
    }

    this.stop = function () {
	clearInterval( timerID );
	if(dbg) console.log("stop timer");
    }
    this.cont = function () {
	var pauseduration = new Date().getTime() - (startTime + timediff);
	startTime += pauseduration;
	timerID = setInterval( LTo.timer.updater, 1000, LTo.timer);
	if(dbg) console.log("cont timer (pause duration: "+pauseduration/1000+"secs");
    }
    
    this.updater = function ( obj ) {
	timediff = new Date().getTime() - startTime;
	var timediffstr = ( timediff / 1000 ).toString();
	$('#status #timer').html( LTo.timer.getTimeDiffStr() );
    }

    this.getTimeDiffStr = function ( ms ) {
	var timediffinms = ( ms ? ms : timediff );
	var totalsecs = Math.floor( timediffinms / 1000 );
	var secs = totalsecs % 60;
	var mins = (totalsecs - secs)/60;
	var result ='';
	if(mins < 10) mins = "0"+mins;
	if(mins < 100) mins = " "+mins;
    	if(secs < 10) secs = "0"+secs;
	result = mins + ":" + secs;

	if ( mins > 44 ) result = '<font color="red">'+result+'</font>'; 
	return result;
    }

    this.getTimeDiff = function () {
	console.log( timediff );
	console.log( this.getTimeDiffStr( timediff ));
    }
}
