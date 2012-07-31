var ledger = require('../');
var logger = ledger.createLogger( {}, [
				       new ledger.transactions.file({})
				       ]);


logger.on('log::error', function(time, msg){
    //do somethign special with errors
});

logger.on('log::*', function(time, msg){
    //catchall for any logs
});


console.log('log');
console.info('info');
console.warn('warn');
console.error('error');
