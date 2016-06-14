/*globals print*/
/*globals dictionaries*/

dictionaries.cedict.postprocessor = function (istr) {
    "use strict";
	var dbg = false,
        ostr = istr,
        pinyinList,
        pinyinHash = {},
        tones = {
            "a": 'āáǎàa',
            "e": 'ēéěèe',
            "i": 'īíǐìi',
            "o": 'ōóǒòo',
            "u": 'ūúǔùu',
            "ü": 'ǖǘǚǜü',
            "v": 'ǖǘǚǜü'
        },
        candidates,
        candDict,
        i,
        key,
        processword,
        word,
        tone,
        vowels,
        vowel,
        vowelOffset;
    
	print("Called cedict postprocessor for str=[" + istr + "]", dbg);
	
    pinyinList =  'ba,pa,ma,fa,da,ta,na,la,ga,ka,ha,zha,cha,sha,za,ca,sa,a,bai,pai,mai,dai,tai,nai,lai,gai,kai,hai,zhai,chai,shai,zai,cai,sai,ai,bao,pao,mao,dao,tao,nao,lao,gao,kao,hao,zhao,chao,shao,rao,zao,cao,sao,ao,ban,pan,man,fan,dan,tan,nan,lan,gan,kan,han,zhan,chan,shan,ran,zan,can,san,an,bang,pang,mang,fang,dang,tang,nang,lang,gang,kang,hang,zhang,chang,shang,rang,zang,cang,sang,ang,me,de,te,ne,le,ge,ke,he,zhe,che,she,re,ze,ce,se,e,bo,po,mo,fo,lo,o,bei,pei,mei,fei,dei,nei,lei,gei,kei,hei,zhei,shei,zei,ei,pou,mou,fou,dou,tou,nou,lou,gou,kou,hou,zhou,chou,shou,rou,zou,cou,sou,ou,ben,pen,men,fen,den,nen,gen,ken,hen,zhen,chen,shen,ren,zen,cen,sen,en,beng,peng,meng,feng,deng,teng,neng,leng,geng,keng,heng,zheng,cheng,sheng,reng,zeng,ceng,seng,eng,er,bu,pu,mu,fu,du,tu,nu,lu,gu,ku,hu,zhu,chu,shu,ru,zu,cu,su,wu,gua,kua,hua,zhua,chua,shua,wa,guai,kuai,huai,zhuai,chuai,shuai,wai,duan,tuan,nuan,luan,guan,kuan,huan,zhuan,chuan,shuan,ruan,zuan,cuan,suan,wan,guang,kuang,huang,zhuang,chuang,shuang,wang,duo,tuo,nuo,luo,guo,kuo,huo,zhuo,chuo,shuo,ruo,zuo,cuo,suo,wo,dui,tui,gui,kui,hui,zhui,chui,shui,rui,zui,cui,sui,wei,dun,tun,nun,lun,gun,kun,hun,zhun,chun,shun,run,zun,cun,sun,wen,dong,tong,nong,long,gong,kong,hong,zhong,chong,rong,zong,cong,song,weng,bi,pi,mi,di,ti,ni,li,ji,qi,xi,yi,lia,jia,qia,xia,ya,yai,biao,piao,miao,fiao,diao,tiao,niao,liao,jiao,qiao,xiao,yao,bian,pian,mian,dian,tian,nian,lian,jian,qian,xian,yan,niang,liang,jiang,qiang,xiang,yang,bie,pie,mie,die,tie,nie,lie,jie,qie,xie,ye,yo,miu,diu,niu,liu,jiu,qiu,xiu,you,bin,pin,min,nin,lin,jin,qin,xin,yin,bing,ping,ming,ding,ting,ning,ling,jing,qing,xing,ying,jiong,qiong,xiong,yong,nü,lü,ju,qu,xu,yu,juan,quan,xuan,yuan,nüe,lüe,jue,que,xue,yue,jun,qun,xun,yun,zhi,chi,shi,ri,zi,ci,si';
    pinyinList = pinyinList.split(',');
    
	for (i = 0; i < pinyinList.length; i += 1) {
        pinyinHash[pinyinList[i]] = 1;
    }

	candidates = istr.match(/[a-züA-Z:]*[1,2,3,4,5]/g, "i");
	if (candidates === null) {
		print("No candidates found: candidates =[" + candidates + "]", dbg);
		return istr;
	}
	print("candidates: [" + candidates + "]", dbg);
	candDict = {};
    /*create candidates dict with candidates*/
	for (i = 0; i < candidates.length; i += 1) {
		candDict[candidates[i]] = "1";
	}

	for (key in candDict) {
        if (candDict.hasOwnProperty(key)) {
            
            processword = candDict[key];
            print("processing candidate[" + key + "]", dbg);

            word = key.slice(0, -1);
            print("word without tone[" + word + "]", dbg);
            
            word = word.replace(/u:/, 'ü');
            if (pinyinHash.hasOwnProperty(word.toLowerCase())) {

                print("is Pinyin", dbg);
                tone = key[key.length - 1];

                vowels = word.toLowerCase().match(/[aeiouü]/g, "i");
                print("tone:[" + tone + "]  numbOfVowels:[" + vowels.length + "] vowels:[" + vowels + "]", dbg);

                /* more than one vowel: put on first, if it's 'a', 'e' or 'o'*/
                vowel = vowels[0];
                if (vowels.length > 1) {
                    switch (vowels[0]) {
                    case "a":
                    case "e":
                    case "o":
                        break;
                    default:
                        vowel = vowels[1];
                        break;
                    }
                }

                vowelOffset = word.toLowerCase().indexOf(vowel);
                print("vowelOffset[" + vowelOffset + "]", dbg);

                word = word.substr(0, vowelOffset) + tones[vowel][tone - 1] + word.substr(vowelOffset + 1);
                print("updated str:[" + word + "]", dbg);

                print("ostr before:[" + ostr + "]", dbg);
                ostr = ostr.split(key).join(word);
                print("ostr after:[" + ostr + "]", dbg);
            } else {
                print(word + " doesnt seem to be Pinyin", dbg);
            }
        }
    }
	return ostr;
};


