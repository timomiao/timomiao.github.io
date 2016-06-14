
LTest.prototype.initQuestions = function () {
    this.state.reset();
    this.idxarray.resetIdx();
    this.switchModeTo('questions');
    this.clickPause();
    this.showQuestion();
}

LTest.prototype.showQuestion = function () {
    $('.ansclass').addClass('nohighlight').removeClass('highlight wrong correct');
    this.hovering('on');
    var idx = this.idxarray.getElement();
    var answerblock = {};
    this.renderPage(idx);
    this.state.hlIDstr = 0;
}

LTest.prototype.lastPic='';

LTest.prototype.renderPage = function (idx) {
    this.currentqobj = this.getQobj(idx);
    this.shuffleAnswers ( this.currentqobj );

    //console.log('rendering idx:['+idx+'] section:['+ this.currentqobj.number.join('.') + ']');
    this.writeMC( this.currentqobj );

    var showpic ='';
    if( this.currentqobj.pic == undefined )
    { showpic = this.catIcons[ this.category ]; }
    else { showpic = this.currentqobj.pic; }

    if( this.lastPic != showpic )
    {
	$('#picture').html(
		this.visTools.vertAligned(
		    this.visTools.calcImgTag( showpic, '#picture' )
		    ));
	this.lastPic = showpic;
    }

    this.updateStatus();
}
   
//shuffles list in-place
LTest.prototype.shuffle = function (list) {
    var i, j, t;
    for (i = 1; i < list.length; i++) {
	j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
	if (j != i) {
	    t = list[i];                        // swap list[i] and list[j]
	    list[i] = list[j];
	    list[j] = t;
	}
    }
    return list;
}

LTest.prototype.shuffleAnswers = function (qobj) {
	var list=[];
	var solution='';
	var langarray = ['en','cn'];
	var possanswers = qobj[langarray[0]].answers;
	var lang='';
	var temphash = {};
	var dbg=0;

	for (var j in possanswers) list.push(j);
	this.shuffle( list );
	
	for( var j in langarray) { temphash[langarray[j]]={}; }
	
	solution = qobj.solution;
	cnt=0;
	for(var i in possanswers) {
	    if( list[cnt] != i ) {  //only, if it should change place
		for( var j in langarray) {
		    lang = langarray[j];
		    temphash[lang][ list[cnt] ] = qobj[lang].answers[i];
		}
		if( i == solution) { qobj.solution = list[cnt]; }
	    }
	    cnt++;
	}

	cnt=0;
	for(var i in possanswers) {
	    if( list[cnt] != i ) {
		for( var j in langarray) {
		    lang = langarray[j];
		    qobj[lang].answers[i] = temphash[lang][ i ];
		}
	    }
	    cnt++;
	}
}

LTest.prototype.writeMC = function (qobj) {
        var lang = LTo.lang;
        var fieldId = '';
        var cnt = 0;
        var answer = '';

	var number = qobj.number;
	var chapternr = number.slice(0,1)[0];
	var sectionnr = number.slice(0,2).join('.');
	var titles = testdata.titles[ lang ];
	var titlestr = chapternr + '. ' + titles.chapters[ chapternr ] + '\n';
	titlestr += sectionnr + ' ' + titles[ sectionnr ];
    
        $('#question').html(this.visTools.vertAligned(qobj[lang].question),'left');
        $('#question').autoSize('autoTextSize',{minSize:15,maxSize:30});
	$('#question').attr('title', titlestr);
        $('.ansclass').hide();
      
	var elemstr = '';
	cnt=0;
	for (var ans in qobj[lang].answers) {
            cnt++;
            answer = qobj[lang].answers[ans];
            elemstr='#'+ans;
            $(elemstr).show();
            $(elemstr+'char').html(this.visTools.vertAligned(ans)); 
            $(elemstr+'text').html(this.visTools.vertAligned(answer,'left'));
            $(elemstr+'text').autoSize('autoTextSize',{minSize:14,maxSize:25});
        }  
    }

LTest.prototype.updateStatus = function () {
    var catidx = this.idxarray.getElement();
    var len = this.idxarray.length();
    var numberstr = this.currentqobj.number.join('.');
    var ratiostr = (this.idxarray.getIdx()+1)+'&nbsp/&nbsp'+len;
    
    var wrongs = this.state.wrong.length;
    if(wrongs > 10) wrongs = '<font color="red">'+ wrongs + '</font>';

    var wrongsstr = testdata.i18nhash.wrong[this.lang]+':&nbsp'+wrongs;
    var statustag = '#status #';

    $(statustag +'number').html(numberstr);
    $(statustag +'ratio').html(ratiostr);
    $(statustag +'wrongs').html(wrongsstr);
}
