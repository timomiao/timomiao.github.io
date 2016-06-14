
LTest.prototype.initMenu = function () {
    this.switchLang(this.lang);
    $('.bbutton').addClass('nohighlight');
    $('.startbuttons').addClass('nohighlight');
    $('#lang'+this.lang).addClass('highlightblue').siblings().addClass('nohighlightblue');
    $('#'+this.category).addClass('correct').siblings().addClass('nohighlight');
    $('#Car').attr('title','C1 C2 C3 C4');
    $('#Bus').attr('title','A1 A3 B1');
    $('#Truck').attr('title','A2 B2');
    $('#SPWM').attr('title','M');

    for( var i in this.catIcons ) { 
	$('#'+i).html( this.visTools.vertAligned( this.visTools.calcImgTag( this.catIcons[i], '#'+i))); 
    }
}

LTest.prototype.catIcons = { 
	"Car":  { "url":"images/icons/car-bw.png", "width":356, "height":137 },
	"Bus":  { "url":"images/icons/bus-bw.png", "width":368, "height":147 },
	"Truck":{ "url":"images/icons/truck-bw.png", "width":409, "height":209 },
	"SPWM": { "url":"images/icons/forklift-bw.png", "width":170, "height":141 }
    };

