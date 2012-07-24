#Ledger
Ledger is an event based NodeJS module used for logging events to stdout, files or MongoDB.

By default Ledger can overwrite `console.log`, `console.info`, `console.warn` and `console.error` to allow all output to be either colorized or outputted to a file or a MongoDB server.


##Installation:
```
npm install ledger
```
    
##Usage:
```
//this will output to stdout/stderr
//ledger.log and MongoDB listening at 127.0.0.1
var ledger = (require('ledger')({
    logFile: 'ledger.log',
    logDb: true,
});
 
ledger.on('log::error', function(time, msg){
    //do something special with errors
});
  
ledger.on('log::*', function(time, msg){
     //log catchall
});
    
console.log('log');
console.info('info');
console.warn('warn');
console.error('error');
```
    
##Options:

* `useColor`: Boolean //whether to colorize stdout/stderr, Default: true
* `separator`: String //separator used when building messages, Default: ' > '
* `timeFormatter`: Function(date) //function used when formatting Date object to a string, Default: function(date){ return date.toString(); }
* `logStdout`: Boolean //whether or not to print to stdout/stderr, Default: true
* `logFile`: String //file to log all messages to, Default: false
* `logDb`: Boolean //whether or not to log to a MongoDB server, Default: false 
* `dbHost`: String //host of MongoDB server, Default: '127.0.0.1'
* `dbPort`: String //port that MongoDB server is listengin on, Default: '27017'
* `dbName`: String //name of MongoDB database, Default: 'ledger'
* `dbCollection`: String //name of collection to store messages in, Default: 'log'
* `dbUser`: String //username to use when connecting to MongoDB server, Default: false
* `dbPass`: String //password used to connect to MongoDB server, Default: false


##Methods:

* `log(msg)` //mapped to console.log
* `info(msg)` //mapped to console.info
* `warn(msg)` //mapped to console.warn
* `error(msg)` //mapped to console.error
* `now()` //get the current time using timeFormatter setting
    
##Events:

* `log::log`: (time, msg) //event that gets called after a call to console.log
* `log::info`: (time, msg) //event that gets called after a call to console.info
* `log::warn`: (time, msg) //event that gets called after a call to console.warn
* `log::error`: (time, msg) //event that gets called after a call to console.error
