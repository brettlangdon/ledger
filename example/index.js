var ledger = require('../')();


ledger.on('log::error', function(time, msg){
    //do somethign special with errors
});

ledger.on('log::*', function(time, msg){
    //catchall for any logs
});


console.log('log');
console.info('info');
console.warn('warn');
console.error('error');
