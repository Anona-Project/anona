/**
 * Created by tonimas on 12/12/16.
 */
var mongoose = require('mongoose');


var coins = new mongoose.Schema({
    idsigned: String,
    idoriginal: String,
    amount: String,
    issuer: String,
    issuedate: String,
    urlcheck: String,
    urlcert: String
});


module.exports = mongoose.model('Coins', coins);