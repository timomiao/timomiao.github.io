#!/usr/bin/python
from mod_python import apache
from mod_python import util
import simplejson
import os

#path relative to app ( e.g. /var/www/licensetest/ <jsonfile> )
jsonfile = 'denyall/testdata.json'

#get cwd
abspath = os.path.dirname(os.path.realpath(__file__))
#cd .. (second os.path.dirname) and add rel. dir
filepath = os.path.dirname( abspath ) + '/' + jsonfile;

try:
    fp = open( filepath )
    testdata = simplejson.load( fp )
except IOError:
    apache.log_error(__file__+': Can\' read data from '+filepath)
else:
    apache.log_error(__file__+': [noerror] Init complete (datafile: '+filepath+' )');
    fp.close()

def handler(req):

    req.content_type = 'application/json'
    req.send_http_header()

    if req.method == "GET" and req.args:
	form = util.FieldStorage( req )
	qindex = form.get("qindex",None)
	if qindex:
	    #req.log_error('serving question idx:'+qindex+' from '+filepath)
	    req.write( simplejson.dumps( {
		"idx":qindex,
		"question": testdata['catalogue'][int(qindex)] 
		})
		)
	    return apache.OK    
	else:
	    return apache.DECLINED
