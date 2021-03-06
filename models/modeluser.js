/**
 * Created by tonimas on 12/12/16.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var UserSchema = mongoose.Schema({

    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    coins: [{}],
    kcoin: {
        type: String
    },
    transactions: [{}]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.hashPassword = function (newpassword, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newpassword, salt, function(err, hash){
            callback(null, hash);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    console.log('estoy en el get username');
    var query = {username: username};
    console.log(query);
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}
