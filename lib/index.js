var ee2 = require('eventemitter2').EventEmitter2;
var util = require('util');
var fs = require('fs');
var colors = require('colors');
var transactions = require('./transactions');

var ledger = function(options, trans){

    options = (options)?options:{};
    this.transactions = (typeof trans === 'object')?trans: [];

    this.separator = (typeof options.separator=='string')?options.separator:' - ';
    this.timeFormatter = function(date){
        return date.toString();
    };
    
    if( typeof options.timeFormatter == 'function' ){
        this.timeFormatter = options.timeFormatter;
    }
    
    this.now = function(){
        return this.timeFormatter( new Date() ).toString();
    }

    ee2.call(this, {
        wildcard: true,
        delimiter: '::'
    });
};
util.inherits(ledger,ee2);

ledger.prototype._log = function(parts){
    var msg = parts.join(this.separator);
    for( var i in this.transactions ){
	this.transactions[i].log( msg, parts );
    }
};

module.exports.createLogger = function( options, trans ){
    var logger = new ledger(options, trans);

    logger.log = function(msg){
	var parts = [logger.now(), 'LOG', String(msg)]
	logger._log(parts);
	
        logger.emit('log::log', String(msg), parts);
    };

    logger.info = function(msg){
	var parts = [logger.now(), 'INFO', String(msg)]
        logger._log(parts);

        logger.emit('log::info', String(msg), parts);
    };

    logger.warn = function(msg){
	var parts = [logger.now(), 'WARN', String(msg)]
	logger._log(parts);

        logger.emit('log::warn', String(msg), parts);
    };

    logger.error = function(msg){
	var parts = [logger.now(), 'ERROR', String(msg)]
	logger._log(parts);

        logger.emit('log::error', String(msg), parts);
    };


    if( options.override !== false ){
	console.log = logger.log;
	console.info = logger.info;
	console.warn = logger.warn;
	console.error = logger.error;    
    }

    return logger;
};

module.exports.transactions = transactions;