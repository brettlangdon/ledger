#Ledger
Ledger is an event based NodeJS module used for logging to various locations.

By default Ledger can overwrite `console.log`, `console.info`, `console.warn` and `console.error` to allow all output, even output from other modules.


##Installation:
```
npm install ledger
```
    
##Usage:
```
//this will output all messages to the file "my/file.log"
var ledger = (require('ledger');
var logger = ledger.createLogger( {}, [
    new ledger.transactions.file( { logFile: 'my/file.log' } ),
]);
 
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

* `separator`: String //separator used when building messages, Default: ' > '
* `timeFormatter`: Function(date) //function used when formatting Date object to a string, Default: function(date){ return date.toString(); }


##Methods:

* `log(msg)` //mapped to console.log
* `info(msg)` //mapped to console.info
* `warn(msg)` //mapped to console.warn
* `error(msg)` //mapped to console.error
* `now()` //get the current time using timeFormatter setting
* `_log(msg,parts)` // raw logging, do not use    


##Events:

* `log::log`: (time, msg) //event that gets called after a call to console.log
* `log::info`: (time, msg) //event that gets called after a call to console.info
* `log::warn`: (time, msg) //event that gets called after a call to console.warn
* `log::error`: (time, msg) //event that gets called after a call to console.error
