
LTest.prototype.hoverenterfun = function(event){
    var obj=event.data.obj;
    var idstr = $(this)[0].id;

    if(idstr!=obj.category ) { 
	obj.resetClassHL('ansclass');
	obj.highLight(idstr,'on'); 
    }
};

LTest.prototype.highLight = function (idstr,onoffstr) {
    var hlc='highlight';
    var nohlc='no'+hlc;
    if(idstr==this.category) { return }; 
    switch (onoffstr) {
	case 'on':
	    $('#'+idstr).removeClass(nohlc).addClass(hlc);
	    this.state.hlIDstr = idstr; 
	    break;
	case 'off':
	    $('#'+idstr).removeClass(hlc).addClass(nohlc);
	    break;
    }
}

LTest.prototype.resetClassHL = function(classname) {
    var ca=classname.split(' ');
    for ( var e in ca) {
	$('.'+ca[e]+'[class~="highlight"]').removeClass('highlight').addClass('nohighlight');
    }
}

LTest.prototype.visTools = {
    vertAligned : function(str,hori) {
		      var marginstr='margin: auto;';
		      if(hori=='left') marginstr='';
		      var ostr='<div style="display: table; '+marginstr;
		      ostr += ' height:100%;"><p style="display: table-cell;';
		      ostr += ' height:100%; vertical-align: middle;">'+str+'</p></div>';
		      return ostr;
		  },
    calcImgTag : function(qpic, jquerytag) {
        var imgtagstr = 'no picture';

        if (qpic){
            var framew = $(jquerytag).width()*0.9;
            var frameh = $(jquerytag).height()*0.9;
            var picw = qpic.width;
            var pich = qpic.height;

            var scalh = frameh/pich;
            var scalw = framew/picw;

            if(scalh < scalw) {pich = frameh; picw*=scalh;}
            else {pich*=scalw; picw = framew;}

            imgtagstr = '<img src="'+qpic.url+
                '" width="'+picw+'" height="'+pich+
                '" />';
        }
        return imgtagstr;
    }
}

LTest.prototype.clickedAnswer = function (idstr) {
    var catidx=this.idxarray.getElement();
    //var correctId = this.qcache.cache[catidx].solution;
    var correctId = this.currentqobj.solution;
    
    this.hovering('off');
    this.resetClassHL('ansclass');

    $('#'+correctId).removeClass('nohighlight').addClass('correct');

    if (correctId!=idstr){
	$('#'+idstr).removeClass('nohighlight').addClass('wrong');
	this.state.wrong.push(catidx);
	//decrease value of stored testdata.catalogue index by one (or -1 if none is yet set)
	this.storage.wrongAnswer(catidx);
	this.updateStatus();
    }
    else
    { this.storage.rightAnswer(catidx); }

    this.state.clickAnywhere = true;
}

LTest.prototype.clickPause = function () {
    this.state.cpause = true;
    setTimeout(function (obj) {obj.state.cpause = false;},500,this);
}

LTest.prototype.moveHL = function(dirstr) {
    this.resetClassHL('startbuttons categories ansclass bbutton sbutton');
    var hlIDstr = this.state.hlIDstr;

    //defaults, first move
    if(hlIDstr==0) {
	switch(this.mode) {
	    case 'menu':
		var start = {up:'Bus',down:'start100',left:'Bus',right:'SPWM'};
		this.highLight(start[dirstr],'on');
		break;
	    case 'questions':    this.highLight('A','on'); break;
	    case 'breakmenu': this.highLight('breakcontinue','on'); break;
	    case 'stats': this.highLight('statsgotobreakmenu','on'); break;
	}
	return;
    }

    switch(this.mode) {
	case 'menu':
	    var mv = {
		up:{start100:'Car',startall:'SPWM'},
		down:{Car:'start100',Bus:'start100',
		    Truck:'startall',SPWM:'startall'},
		left:{Bus:'Car',Truck:'Bus',SPWM:'Truck',
		    start100:'SPWM',startall:'start100'},
		right:{Car:'Bus',Bus:'Truck',Truck:'SPWM',
		    SPWM:'start100',start100:'startall'}
	    }

	    var altmv = { start100:'Bus',startall:'Truck'};

	    if(mv[dirstr][hlIDstr]) {
		var target = mv[dirstr][hlIDstr];
		if( $('#'+target).hasClass('correct') )
		{
		    if(mv[dirstr][target]) { target = mv[dirstr][target]; }
		    else if (altmv[hlIDstr]) { target = altmv[hlIDstr]; }
		    else { target = hlIDstr; }
		}		   
		this.highLight(this.state.hlIDstr,'off');
		this.highLight(target,'on');
	    }
	    else { this.highLight(hlIDstr,'on'); }
	    break;
	case 'questions':
	    if(this.state.clickAnywhere) {return} 
	case 'breakmenu':
	    var newidx=0;
	    newidx=this.getSiblingId(hlIDstr,dirstr);
	    this.highLight(hlIDstr,'off');
	    this.highLight(newidx,'on');
	    break;
	case 'stats':
	    this.highLight('statsgotobreakmenu','off');
	    this.highLight('statsclearstats','off');
	    if( dirstr == "up") { 
		this.highLight('statsclearstats','on');
	    }
	    else if ( dirstr == "down" ) {
		this.highLight('statsgotobreakmenu','on');
	    }
    }
}

LTest.prototype.getSiblingId = function (startId, dirstr) {
    var sibs=[];
    var filterDisabled = function () {
	var mat=$(this).attr('style').match(/opacity\: (\d[\.\d]*)/);
	if( ! $(this).is(':visible') ) { return false; }
	if( (mat && mat.length && parseFloat(mat[1])<1) ) { return false; }
	return true;
    }

    switch(dirstr) {
	case 'up':    sibs = $('#'+startId).prevAll().filter(filterDisabled); break;
	case 'down' : sibs = $('#'+startId).nextAll().filter(filterDisabled); break;
    }

    if(sibs.length){ return sibs[0].id; }
    else { return startId; }
}

LTest.prototype.hovering = function(onoffstr) {
    switch(onoffstr){
	case 'on':  $('.ansclass').bind('mouseover',{obj:this},this.hoverenterfun); break;
	case 'off': $('.ansclass').unbind('mouseover'); break;
    }
}

LTest.prototype.clickHL = function () {
    $('#'+this.state.hlIDstr).click();
    $(document).trigger('click');
}


LTest.prototype.switchLang = function (newlang) {
    if(newlang) { this.lang=newlang; }
    else {
	if(this.lang == 'cn') { this.lang = 'en'}
	else {this.lang = 'cn'}
    }

    for(var e in testdata.i18nhash) {
	$('#'+e).html(this.visTools.vertAligned(testdata.i18nhash[e][this.lang]));
    }

    $('.langs').removeClass('highlightblue').addClass('nohighlightblue');
    $('#lang'+this.lang).removeClass('nohighlightblue').addClass('highlightblue');
    return this;
}

/*
 * switch to menu, multiple choice sheet or breakmenu
 */
LTest.prototype.switchModeTo = function (modestr) {
    var formermode = this.mode;
    this.mode = modestr;
    switch(modestr) {
	case 'menu':    
	    $('#questions,#breakmenu,#stats').hide();
	    this.highLight('start100','on');
	    break;
	case 'questions': 
	    $('#breakmenu,#menu,#stats').hide();
	    $('#lower,#question').fadeTo(100,1);
	    if( formermode == 'menu' ) { this.timer.start();}
	    break;
	case 'breakmenu':
	    this.timer.stop();
	    $('#stats').hide();
	    $('#questions').show();
	    $('.bbutton').fadeTo(1,1);
	    if(this.idxarray.last() && this.state.clickAnywhere) {
		$('#breakcontinue').fadeTo(1,0.6); }
	    if(this.state.wrong.length==0) { 
		$('#breakretrywrongs').fadeTo(1,0.6); }

	    $('#breakmenu').css('left',$('#questions').offset().left);
	    this.resetClassHL('bbutton');
	    this.highLight('breakcontinue','on'); 
	    $('#lower,#question').fadeTo(1,0.2);
	    break;
	case 'stats':
	    $('#breakmenu,#menu,#questions').hide();
	    this.updateStatsPage();
	    break;
    }
    $('#'+modestr).show();
}
