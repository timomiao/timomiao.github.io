
LTest.prototype.setHandlers = function() {
    this.setHandlersDocument(this);
    this.setHandlersMenu(this);
    this.setHandlersQuestionPage(this);
    this.setHandlersBreakPage(this);
    this.setHandlersStatsPage(this);
}

LTest.prototype.setHandlersDocument = function (obj){
    $(document).bind('keydown', {obj:obj}, obj.keyHandler);
    $(document).bind('click', function () {
	if (obj.state.clickAnywhere && ! obj.state.cpause) {
	    if (!obj.idxarray.last()) {
		obj.state.clickAnywhere = false;
		obj.idxarray.next();
		obj.showQuestion();
	    }
	    else {
		obj.switchModeTo('breakmenu');
	    }
	}
    });
}

LTest.prototype.setHandlersMenu = function (obj){
    $('.categories,.startbuttons').bind('mouseover', function () {
	obj.resetClassHL('startbuttons');
	obj.resetClassHL('categories');
	obj.highLight($(this)[0].id,'on');
    });

    $('.categories').click( function (event) {
	$('.categories[class~="correct"]').removeClass('correct').addClass('nohighlight');
	$(this).removeClass('highlight nohighlight').addClass('correct');
	obj.category = $(this)[0].id;
	$('#start100').trigger('mouseover');
    });

    $('.startbuttons').click( function (event) {
	switch($(this)[0].id) {
	    case 'start100': obj.idxarray.createTestArray(LTo.category);break;
	    case 'startall': obj.idxarray.createFullTestArray(LTo.category);break;
	}
	obj.initQuestions();
    });
    $('.langs').click( function (event) {
	obj.switchLang($(this)[0].id.substring(4,6));
    });
}

LTest.prototype.setHandlersQuestionPage = function(obj){
    $('.ansclass').click( function (event) {
	if(! obj.state.cpause && 
	    ! obj.state.clickAnywhere && 
	    $(this).is(':visible')
	  ) {
	    obj.hovering('off');
	    obj.clickedAnswer( this.id );
	    obj.clickPause();
	}
    });

    $('#status').click( function (event) { LTo.switchModeTo('breakmenu'); });
}

LTest.prototype.setHandlersBreakPage = function(obj){
    $('.bbutton').bind('mouseover', function () {
	obj.resetClassHL('bbutton');
	obj.highLight($(this)[0].id,'on');
    });

    $('#breakretryfresh').click(  function () { 
	obj.idxarray.createTestArray(LTo.category); 
	obj.initQuestions();
	obj.timer.start();
    });
    $('#breakretrywrongs').click( function () { 
	if( ! obj.state.wrong.length) return false; 
	obj.idxarray.setArray(obj.state.wrong); 
	obj.initQuestions();
	obj.timer.start();
    });

    $('#breakcontinue').click( function () {
	if(obj.idxarray.last() && obj.state.clickAnywhere) { return }
	obj.state.hlIDstr=0;
	obj.switchModeTo('questions');
	obj.clickPause();
	obj.timer.cont();
    });

    $('#breakgotomenu').click( function () { 
	obj.state.reset();
	obj.qcache.resetprecache();
	obj.switchModeTo('menu');
	obj.clickPause();
    });
    $('#breakstats').click( function () {
	obj.switchModeTo('stats');
	obj.clickPause();
    });
}

LTest.prototype.setHandlersStatsPage = function (obj){
    $('.sbutton').bind('mouseover', function () {
	obj.resetClassHL('sbutton');
	obj.highLight($(this)[0].id,'on');
    });
    
    $('#statsgotobreakmenu').click( function () {
	obj.switchModeTo('breakmenu');
	obj.clickPause();
    });
    $('#statsclearstats').click( function () {
	obj.resetStats();
	obj.clickPause();
    });
} 

LTest.prototype.keyHandler = function (event) {
    var obj=event.data.obj;
    var keyp = event.keyCode;
    if(keyp >40) { 
	keyp = String.fromCharCode(keyp);
    }
    if(obj.debug) console.log('mode:'+obj.mode+' keyHandler event code: '+keyp);

    switch(String(keyp)) {
	case "37": obj.moveHL('left'); break;
	case "38": obj.moveHL('up'); break;
	case "39": obj.moveHL('right'); break;
	case "40": obj.moveHL('down'); break;
	case "13": obj.clickHL(); break; //Enter
    }

    if(obj.mode=='menu') {
	switch(String(keyp)){
	    case "L": obj.switchLang(); break;
	}
    }
    else if(obj.mode=='questions'){
	if(keyp>0 && keyp<5) {
	    var trans=['A','B','C','D'];
	    $('#'+trans[keyp-1]).click();
	    return;
	}
	else if(String(keyp).match(/[ABCD]/)) {
	    $('#'+keyp).click();
	    return;
	}

	switch(String(keyp)){
	    case "L": obj.switchLang().renderPage(obj.idxarray.getElement());
		      break;
	    case "27": obj.switchModeTo('breakmenu'); break; 
	}
    }
    else if(obj.mode=='breakmenu'){
	switch(String(keyp)){
	    case "27": $('#breakcontinue').click(); break;
	}
    }
}
