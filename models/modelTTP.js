/**
 * Created by irkalla on 19.01.17.
 */
var mongoose = require('mongoose');


var transaction_record = new mongoose.Schema({
    id_transaction: String,
    product_name: String,
    amount: String,
    vendor: String,
    buyer: String,
    datetime: { type: Date, default: Date.now }

});


var Records = module.exports = mongoose.model('Records', transaction_record);

