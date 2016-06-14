#!/usr/bin/env python
# coding: utf-8
import re
import string

class questionblock(object):
    def __init__(self,number,question,answers,solution):
        self.number=number
        self.question=question
        self.answers=answers
        self.solution=solution
        

class questions(object):
    def __init__(self):
        self.size=0
        self.questlist={'en':[],'cn':[]}

    def insert(self,questionblock,lang):
        self.size+=1
        self.questlist[lang].append(questionblock)

    def getsize(self):
        return (len(self.questlist['en']),len(self.questlist['cn']))

f=open('./questions2.txt','r')
questlist=questions()

block=0
count=0
saved=0
lang='en'
leadingindex=0
maxindex=0

for line in f.readlines():
    count+=1
    line=unicode(line,"utf-8")
    line=line.rstrip('\r\n')

    if block:
        pattern=u'[ABCDabcd][\uff0e.]'
        match=re.search(pattern,line)
        if match and match.group(0):
            answkey=match.group(0).rstrip('.')
            rightindex=match.span(0)[1]
            answers[answkey]=line[rightindex:].strip()
            saved+=1
           # print "answkey=["+answkey+"]  answval=["+answers[answkey]+"]"
        else:
            if lang=='en': pattern='Answer:'
            else: 
               # pattern=unicode('答案：',"utf-8")
                pattern=u'\u7b54\u6848[\uff1a:]'
            match=re.search(pattern,line)
            if match and match.group(0):
                rightindex=match.span(0)[1]
                solution=line[rightindex:].strip()
                

                if answers=={}:
                    chinwr=unicode('正确 错误',"utf-8")
                    chinwr=chinwr.split(' ')

                    if solution==chinwr[0]:
                        solution='A'
                    else:
                        solution='B'

                    if lang=='en':
                        answers={'A':'right','B':'wrong'}
                    else:
                        answers={'A':chinwr[0],'B':chinwr[1]}
                
                
                saved+=1
             #   print "solution=["+solution+"]"
             #  print "build block: number="+number+" question="+question+" solution="+solution
                newquest=questionblock(number,question,answers,solution)
                questlist.insert(newquest,lang)
                block=0
                
                continue
            else:
                print "unrecognized line %d in block: [%s]" %(count,line)
             #   import code; code.interact(local=locals())


    
    if not block:
        match=re.search('\d+\.\d+\.\d+\.\d+',line)
        if match and match.group(0):
            block=1
            answers={}
            number=match.group(0).strip()
          #  leadingnumber=int(number.split('.')[0])
            #print "XXX number=%s\tleading=%d"%(number,leadingnumber)

           # if leadingnumber>maxindex: maxindex=leadingnumber
            
            
            #if leadingnumber<maxindex:
             #   leadingnumber=maxindex+1
              #  number=str(leadingnumber)+"."+number.partition('.')[2] 
                #print "number=%s\tleadingnumber=%d\tmaxindex=%d"%(number,leadingnumber,maxindex)
             #   import code; code.interact(local=locals()) 
            
            question=line[match.span(0)[1]:].strip()
            if re.search(ur'[\u4e00-\u9fff]',question):
                lang='cn'
            else:
                lang='en'
                
            saved+=1
            #print "Idx=["+number+"] (lang="+lang+") question=["+question+"]"
        else:
            #import code; code.interact(local=locals())
            print "no block at line %d: [%s]" % (count,line)
#line=line.encode("utf-8")
(ensize,cnsize)=questlist.getsize()
#print "read lines:%d\tsaved:%d\tquestions:%d(en)%d(cn)" % (count,saved,ensize,cnsize)    


#grafikfragen:
#1.1.1.15-17
#2.2.1.1-101
#2.2.2.1-62
#2.3.1.1-28
#2.3.2.2-15 (nummerierung kaputt am ende?)
#2.4.1.1-11
#2.4.2.1-11
#6.2.1.3-8
#1.1.1.19-29
#1.1.2.1-2
piclist={}

ils=open('./imglinksshort.txt','r')
for line in ils.readlines():
    line=line.rstrip('\r\n')
    line=line.split(' ')
    numb=line[0]
    filename=line[1]
    width=int(line[2].split(':')[1])
    height=int(line[3].split(':')[1])

#    print "number:%s\twid=%d\thei=%d" % (numb,width,height)
    if numb in piclist: 
        print "error - double piclist entry %s"%numb
        exit()

    piclist[numb]={'filename':filename,'width':width,'height':height}

#print "lenpiclist: %d"%len(piclist)



print "var catalogue=["
for i in range(ensize):
    block=questlist.questlist['en'][i]
    idxs=block.number.split('.')
    idxs=[int(numb) for numb in idxs]

    print '\t{'
    print '\t"number":%s,'%idxs 

    for language in ['en','cn']:
        block=questlist.questlist[language][i]
        print '\t"%s": {'%language
        ostr= '\t\t"question":"%s",'%block.question
        print ostr.encode('utf-8')
        print '\t\t"answers":{'

        for answ in block.answers:
            ostr='\t\t\t"%s":"%s",'%(answ,block.answers[answ])
            print ostr.encode('utf-8') 
           # if language=='cn':
            #    import code; code.interact(local=locals())
       

        print '\t\t}\n\t},'

    if block.number in piclist:
        currente=piclist[block.number];

        (picfilename,width,height)=(currente['filename'],currente['width'],currente['height']);
        print '\t\t"pic":{"url":"images/%s",'%picfilename
        print '\t\t\t"width":%d,'%width
        print '\t\t\t"height":%d'%height
        print '\t\t},'

    ostr='\t\t"solution":"%s"'%block.solution
    print ostr.encode('utf-8')
    if (i<ensize-1):
        print '\t},'
    else:
        print '\t}\n]'
 #   import code; code.interact(local=locals())
    

#    count+=1
#    if count>3: exit()

exit()
for block in questlist.questlist['en']:
    exit()
    idxs=block.number.split('.')
    
    idxs=[int(numb) for numb in idxs]
    
    match=re.search('[ABCD]',block.solution)
    if match and match.group(0):
        answer=block.answers[block.solution]
    else:
        answer=block.solution


    number=block.number
    question=block.question.encode("utf-8")
    answer=answer.encode("utf-8")

    #import code; code.interact(local=locals())
    print "Q(%s):%s\nA:%s" %(number, question, answer)
    count+=1
    if count>3: exit()
