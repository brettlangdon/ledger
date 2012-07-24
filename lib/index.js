var ee2 = require('eventemitter2').EventEmitter2;
var util = require('util');
var fs = require('fs');
var colors = require('colors');

var ledger = function(options){

    options = (options)?options:{};
    
    
    this.useColor = (typeof options.useColor=='boolean')?options.useColor:true;
    this.separator = (typeof options.separator=='string')?options.separator:' > ';
    
    this.logStdout = (typeof options.logStdout=='boolean')?options.logStdout:true;
    this.logFile = (typeof options.logFile=='string')?options.logFile:false;
    this.logDb = (typeof options.logDb=='boolean')?options.logDb:false;
    

    this.dbHost = (typeof options.dbHost=='string')?options.dbHost:'127.0.0.1';
    this.dbPort = (options.dbPort)?options.dbPort:'27017';
    this.dbName = (typeof options.dbName=='string')?options.dbName:'ledger';
    this.dbCollection = (typeof options.dbCollection=='string')?options.dbCollection:'log';
    this.dbUser = (typeof options.dbUser=='string')?options.dbUser:false;
    this.dbPass = (typeof options.dbPass=='string')?options.dbPass:false;

    this.dbConnectionString = 'mongo://';
    if( this.dbUser ){
        this.dbConnectionString += this.dbUser + ':' + this.dbPass + '@';
    }
    this.dbConnectionString += this.dbHost + ':' + this.dbPort + '/' + this.dbName;

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

module.exports = function( options ){
    var logger = new ledger(options);

    logger._stdout = function(msg){
        process.stdout.write(msg);
    };
    
    logger._file = function(msg){
        fs.open(logger.logFile, 'a+', function(err,fd){
            fs.write(fd, msg, null, null, null, function(err,written,buffer){
                fs.close(fd);
            });
        });    
    };
    
    logger._db = function(msg, type){
        var obj = {
            time: logger.now(),
            type: type,
            message: msg,
            timestamp: Math.round( new Date().getTime()/1000.0 )
        }
        var db = new (require('mongolian'))(logger.dbConnectionString, {log:false});
        var dbLog = db.collection(logger.dbCollection);
        dbLog.insert(obj, function(){
            db.server.close();
        });
    };
    
    logger._stderr = function(msg){
        process.stderr.write(msg);
    }

    logger.log = function(msg){
        var now = logger.now();
        msg = String(msg);

        if(logger.logStdout){
            logger._stdout( ((logger.useColor)?now.grey:now) +
                            logger.separator +
                            msg + '\r\n' );
        }
        
        if(logger.logFile){
            logger._file(now + logger.separator + 'LOG' + logger.separator + msg + '\r\n');
        }
        
        if(logger.logDb){
            logger._db(msg, 'log');
        }
        
        logger.emit('log::log', now, msg);
    };

    logger.info = function(msg){
        var now = logger.now();
        msg = String(msg);

        if(logger.logStdout){
            logger._stdout( ((logger.useColor)?now.grey:now) +
                            logger.separator +
                            ((logger.useColor)?msg.grey:msg) +
                            '\r\n' );
        }
        
        if(logger.logFile){
            logger._file(now + logger.separator + 'INFO' + logger.separator + msg + '\r\n');
        }
        
        if(logger.logDb){
            logger._db(msg, 'info');
        }
        
        logger.emit('log::info', now, msg);
    };

    logger.warn = function(msg){
        var now = logger.now();
        msg = String(msg);

        if(logger.logStdout){
            logger._stdout( ((logger.useColor)?now.grey:now) +
                            logger.separator +
                            ((logger.useColor)?msg.yellow:msg) +
                            '\r\n' );
        }
        
        if(logger.logFile){
            logger._file(now + logger.separator + 'WARN' + logger.separator + msg + '\r\n');
        }
        
        if(logger.logDb){
            logger._db(msg, 'warn');
        }
        
        logger.emit('log::warn', now, msg);
    };

    logger.error = function(msg){
        var now = logger.now();
        msg = String(msg);

        if(logger.logStdout){
            logger._stdout( ((logger.useColor)?now.grey:now) +
                            logger.separator +
                            ((logger.useColor)?msg.red:msg) +
                            '\r\n' );
        }
        
        if(logger.logFile){
            logger._file(now + logger.separator + 'ERROR' + logger.separator + msg + '\r\n');
        }
        
        if(logger.logDb){
            logger._db(msg, 'error');
        }
        
        logger.emit('log::error', now, msg);
    };


    
    console.log = logger.log;
    console.info = logger.info;
    console.warn = logger.warn;
    console.error = logger.error;    

    return logger;
};
