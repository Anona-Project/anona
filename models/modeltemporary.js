/**
 * Created by mbmarkus on 28/12/16.
 */

var mongoose = require('mongoose');

var temporary = new mongoose.Schema({
    id: String,
    ecoins: [{}]
});

module.exports = mongoose.model('Temporary', temporary);