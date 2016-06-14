
LTest.prototype.initStats = function () {
    $('.sbutton').addClass('nohighlight');
    for (var i in 
	    [
	    "#statspagetitle",
	    "#statsclearstats",
	    "#statsgotobreakmenu"
	    ]) {    
	$(i).autoSize('autoTextSize',{minSize:14,maxSize:25});
    }
}

LTest.prototype.updateStatsPage = function () { 

    this.storage.updateStats(this.category);
    var stats = $.jStorage.get("stats");
    var total = stats["total"];
    var wrong = stats["totalwrong"];

    var numberOfQs = 0;
    var ranges = testdata.categoryRanges[this.category];
    for (var i in ranges) { numberOfQs += ranges[i][1]-ranges[i][0]+1; }

    var wrongRatio = 0;
    if( stats.total != 0 ) { 
	wrongRatio =(stats.wrong * 100 / stats.total).toFixed(2); 
    }

    var statsCollection = {
	categorysheets: numberOfQs,
	total:  stats.total,
	finishedratio: ( total*100 / numberOfQs ).toFixed(2),
	wrong:  stats.wrong,
	wrongratio: wrongRatio, 
	mintotal:	stats.mintotal,
	maxtotal:	stats.maxtotal
//, meantotal:	(stats.meantotal*100).toFixed(2)
    }

    this.markRed = function (str) {
	return '<font color="red">'+str+'</font>';
    }

    if( statsCollection.wrongratio > 90) {
	statsCollection.wrongratio = this.markRed (statsCollection.wrongratio);
    }
    statsCollection.wrongratio+='%';


    var tablestr='<table border="0">';
    for ( var i in statsCollection ) {
	tablestr += '<tr>';
	tablestr += '<td>' + testdata.statsStrings[i][this.lang] + ':</td>';
	tablestr += '<td>' + statsCollection[i] + '</td>';
	tablestr += '</tr>';
    }
    tablestr+='</table>'

	$('#statstable').html( tablestr );	

}

LTest.prototype.resetStats = function () {
    this.storage.reset();
    this.updateStatsPage();
}
