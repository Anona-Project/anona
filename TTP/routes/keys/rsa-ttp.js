/**
 * Created by irkalla on 19.01.17.
 */
var keys = require('./ttp-keys');
var bignum = require('bignum');

var rsa ={

    publicKeyTTP: function() {
        return {cert: 'TTP test',e:keys.publicKey.e,n:keys.publicKey.n};
    },
    privateKeyTTP: function() {
        return keys.privateKey.d;
    }

};

module.exports = rsa;