/**
 * Created by tonimas on 12/12/16.
 */
var mongoose = require('mongoose');


var coins = new mongoose.Schema({
    id: String,
    idsigned: String,
    amount: String,
    issuer: String,
    issuedate: String,
    urlcheck: String,
    urlcert: String
});


var Coins = module.exports = mongoose.model('Coins', coins);

module.exports.createCoin = function(blackCoin, callback){
            blackCoin.save(callback);
}