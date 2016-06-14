
var testdata = {

    //ration for chapter x(int) for license type y(str):
    //ratios[ratios['cat']['y']][x]
    //regional regulations (each type 5%) are included as additions
    ratios : {//0      1     2   3   4   5  6  7    8  9 10 
		 "Car":   [0,  25+3, 20+2, 20, 10, 10, 5, 5,   0, 0, 0],//5 regional regulations
		 "Bus":   [0,  25+3, 15+2, 20, 10, 10, 5, 5,   5, 0, 0],//5
		 "Truck": [0,  25+3, 15+2, 20, 10, 10, 5, 5,   0, 5, 0],//5
		 "SPWM":  [0,  25+3, 15+2, 20, 10, 10, 5, 5,   0, 0, 5],//5
		 "Bike":  [0,  25+3, 25+2, 25, 10,  5, 1, 4,   0, 0, 0],
		 "cat": {"C1":"Car", "C2":"Car", "C3":"Car","C4":"Car",
		     "A1":"Bus", "A3":"Bus", "B1":"Bus",
		     "A2":"Truck", "B2":"Truck",
		     "M":"SPWM",
		     "D":"Bike","E":"Bike","F":"Bike"
		 }
	     },

    indexOfNumber : function(numberstr){
			var stat = 'not found';
			var cnt = 0;
			while(cnt<catalogue.length) {
			    if(catalogue[cnt]["number"].join('.')==numberstr) {return cnt;}
			    cnt++;
			}
			return stat;
		    },
    //offsets of sections (last offset marks endindex+1)
    //		  1   2   3   4    5    6    7      8    9   10      11
    sectionOffSets : [0,441,699,938,1065,1207,1271,  1320,1379,1449,   1500],
    categoryRanges : { 
	"Car": [[0,1319]],
	"Bus": [[0,1378]],
	"Truck": [[0,1319],[1379,1448]],
	"SPWM": [[0,1319],[1449,1499]],
	"Bike": [[0,1319]]
    },

    //helper function to check offsets
    catCheckOffsets : function(){
			  var offsets = [];
			  var startidx = 0;
			  var endidx = 0;

			  for(var i = 1; i<11; i++) {
			      while(catalogue[endidx] && catalogue[endidx].number[0]==i)
			      {endidx++;}
			      offsets.push([startidx,endidx-1]);
			      startidx = endidx;
			  }
			  return offsets
		      },

    titles : {
		 "en":{
		     "main":"Subject 1 Test Question Bank for Motorized Vehicle Drivers (Motor Vehicles)",
		     "origin":"Traffic Control Bureau Ministry of Public Security",
		     "chapters":["dummy",
		     "Laws, Rules and Regulations on Road traffic safety",
		     "RoadTraffic Signals and Their Meanings",
		     "Knowledge on Safe and Courteous Driving",
		     "Knowledge about Save Driving on Expressways and Mountain Roads, through Bridges and Tunnels, at Night, in Bad Weather and Complex Road Conditions",
		     "Knowledge on Dealing with Emergency such as Tire Blowout, Steering out of Control and Braking Failure etc.",
		     "Common Knowledge on Overall Structures and Main Safety Devices of Motorized Vehicles and Routine Vehicle Inspection and Maintenance",
		     "Common Knowledge on Self-Rescue and First-Aid after Traffic Accident, and Common Dangerous Chemicals",
		     "Test Questions Exclusively for Buses",
		     "Test Questions Exclusively for Trucks",
		     "Test Questions Exclusively for Self-Propelled Wheeled Machinery"
			 ], 
		     "1.1":"Law on Road Traffic Safety",
		     "1.2":"Regulations on Implementing the Law on Road Traffic Safety",
		     "1.3":"Criminal Law",
		     "1.4":"Generel Principles of the Civil Law",
		     "1.5":"Procedural Regulations for Handling Road Traffic Safety Violations",
		     "1.6":"Procedural Regulations for Handling Traffic Accidents",
		     "1.7":"Regulations on the Application for and Use of Motorized Vehicle Driving Licenses",
		     "1.8":"Regulations on Motorized Vehicle Registration",
		     "1.9":"Regulations on Mandatory Road Accient Insurance",
		     "2.1":"Traffic Signal Lights",
		     "2.2":"Traffic Signs",
		     "2.3":"Traffic Markings",
		     "2.4":"Hand Signals of Traffic Police",
		     "3.1":"Essentials of Safe Operation",
		     "3.2":"Impact of Driving Environment on Safe Driving",
		     "3.3":"Courteous Driving",
		     "3.4":"Safe Driving",
		     "4.1":"Safe Driving on Expressways",
		     "4.2":"Safe Driving on Mountain Roads",
		     "4.3":"Safe Driving through Bridges and Tunnels",
		     "4.4":"Safe Driving at Night",
		     "4.5":"Safe Driving in Bad Weather and Complex Road Conditions",
		     "5.1":"Emergency on Dealing with Tire Blowout",
		     "5.2":"Emergency on Dealing with Steering out of Control",
		     "5.3":"Emergency on Dealing with Braking Failure",
		     "5.4":"Emergency on Dealing with Going dead of an Engine",
		     "5.5":"Emergency on Dealing with Vehicle Side Slide",
		     "5.6":"Emergency on Dealing with Vehicle Collision",
		     "5.7":"Emergency on Dealing with Vehicle Overturn",
		     "5.8":"Emergency on Dealing with Vehicle Fire on Driving",
		     "5.9":"Emergency on Dealing with Vehicle Falling into Water",
		     "5.10":"Emergency on Avoiding Accidents on Expressways",
		     "5.11":"Emergency on Dealing with Side Wind",
		     "5.12":"Principles for Dealing with Emergencies",
		     "6.1":"Common knowledge on Overall Structures of Motorized Vehicles",
		     "6.2":"Common knowledge on Main Safety Devices",
		     "6.3":"Commond knowledge on Routine Vehicle Inspection and Maintenance",
		     "7.1":"Self-Rescue and First-Aid for the Wounded",
		     "7.2":"Common Dangerous Chemicals"
		 },
		 "cn":{
		     "main":"TODO: Translation",
		     "origin":"TODO: Translation",
		     "chapters":["dummy",
		     "道路交通安全法律、法规和规章",
		     "道路交通信号及含义",
		     "安全行车、文明驾驶知识",
		     "高速公路、山区道路、桥梁、隧道、夜间、恶劣气象和复杂道路条件下的安全驾驶知识",
		     "出现爆胎、转向失控、制动失灵等紧急情况时临危处置知识汽车类题库目录通用试题",
		     "机动车总体构造和主要安全装置常识、日常检查和维护基本知识",
		     "发生交通事故后的自救、急救等基本知识，以及常见危险化学品等知识"
			 ],
		     "1.1":"道路交通安全法",
		     "1.2":"交通安全法实施条例",
		     "1.3":"刑法",
		     "1.4":"民法通则",
		     "1.5":"道路交通安全违法行为处理程序规定",
		     "1.6":"交通事故处理程序规定",
		     "1.7":"机动车驾驶证申领和使用规定",
		     "1.8":"机动车登记规定",
		     "1.9":"机动车交通事故强制保险条例",
		     "2.1":"交通信号灯",
		     "2.2":"交通标志",
		     "2.3":"交通标线",
		     "2.4":"交通警察手势信号",
		     "3.1":"安全操作要领",
		     "3.2":"驾驶环境对安全行车的影响",
		     "3.3":"文明驾驶",
		     "3.4":"安全驾驶行为",
		     "4.1":"高速公路安全驾驶知识",
		     "4.2":"山区道路安全驾驶知识",
		     "4.3":"通过桥梁、隧道的安全驾驶知识",
		     "4.4":"夜间安全驾驶知识",
		     "4.5":"恶劣气象和复杂道路条件下的安全驾驶知识",
		     "5.1":"轮胎爆胎时的应急处置",
		     "5.2":"转向突然不灵、失控时的应急处置",
		     "5.3":"制动突然失灵时的应急处置",
		     "5.4":"发动机突然熄火应急处置",
		     "5.5":"车辆侧滑时的应急处置",
		     "5.6":"车辆碰撞时的应急处置",
		     "5.7":"车辆倾翻时的应急处置",
		     "5.8":"车辆发生行车火灾时的应急处置",
		     "5.9":"车辆落水后的应急处置",
		     "5.10":"高速公路紧急避险",
		     "5.11":"遇横风时的应急处置",
		     "5.12":"紧急情况处置的原则",
		     "6.1":"机动车总体构造常识",
		     "6.2":"主要安全装置常识",
		     "6.3":"车辆日常检车和维护基本知识 ",
		     "7.1":"伤员自救、急救知识",
		     "7.2":"常见危险化学品知识"
		 }
	     },

    i18nhash : {
		   //menu              
		   menutitle:{ en:'Traffic License Test',cn:'驾驶证考试'},
		   langen:{ en:'Eng',cn:'英文'},
		   langcn:{ en:'Chn',cn:'中文'},
		   /*    Car:{ en:'Car',cn:'汽车'},
			 Bus:{ en:'Bus',cn:'客车'},
			 Truck:{ en:'Truck',cn:'货车'},
			 SPWM:{ en:'SPWM',cn:'轮式自行机械车'},
			 */
		   start100:{ en:'Usual Test<br>(100 questions)', 
		       cn:'普通考试<br>（100个问答）'},
		   startall:{ en:'All questions',cn: '所有问题'},
		   //questions      
		   wrong: {en:'wrong',cn:'错误'},
		   //breakmenu
		   breakretryfresh:{en:'Test again',cn:'再测一次'},
		   breakretrywrongs:{en:'Retry wrong answers',
		       cn:'如果回答错误，请再试一次'},
		   breakgotomenu:{en:'Menu',cn:'菜单'},
		   breakcontinue:{en:'Continue',cn:'继续'},
		   breakstats:{en:'Stats',cn:'cn-stats'},
		   statspagetitle: {en: 'Statistics',cn: 'cn-statistiks'},
		   statsclearstats: {en: 'Clear', cn:'cn-clearstats'},
		   statsgotobreakmenu:{en:'Cancel', cn: 'cn-cancel'}
	       },
    statsStrings : {
		       categorysheets: {en: 'Number of sheets in category', cn:''},
		       total:	    {en:'Number of finished sheets', cn:''},
		       finishedratio:  {en:'Percentage of finished sheets', cn:''},
		       wrong:	    {en:'Number of wrong answers', cn:''},
		       wrongratio:	    {en:'Percentage of wrong answers', cn:''},
		       mintotal:	    {en:'Minimal occurances of a sheet', cn:''},
		       maxtotal:	    {en:'Maximal occurances of a sheet', cn:''},
		       meantotal:	    {en:'Mean value of occurances of a sheet', cn:''}
		   }
}
