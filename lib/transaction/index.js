var transaction = function(options){
    this.options = (typeof options == 'object')?options:{};
};
transaction.prototype = {
    log: function(msg,parts){
	throw "Ledger Transaction log() Not Implemented"
    },
};

module.exports = transaction;