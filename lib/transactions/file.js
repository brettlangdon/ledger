var util = require('util');
var transaction = require('../transaction');
var fs = require('fs');

var file = function(options){
    transaction.call(this,options);

    if( !(typeof this.options.logFile === 'string') ){
	this.options.logFile = 'ledger.log';
    }

};
util.inherits(file,transaction);

file.prototype = {
    log: function(msg,parts){
	if( typeof this.options.logFile === 'string'){
	    fs.open(this.options.logFile, 'a', function(err,fd){
		    if( err ) throw err;
		    fs.write( fd, msg+'\n', null, null, null, function(err){
			    if( err ) throw err;
			    fs.close(fd);
			});
		});
	}
    },
};
module.exports = file;