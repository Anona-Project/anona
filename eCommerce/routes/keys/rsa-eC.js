/**
 * Created by irkalla on 14.01.17.
 */
var keys = require('./ecommerce-keys');
var bignum = require('bignum');

var rsa ={

    publicKeyCommerce: function() {
        return {cert: 'eCommerce ANONA test',e:keys.publicKey.e,n:keys.publicKey.n};
    },
    privateKeyCommerce: function() {
        return keys.privateKey.d;
    }

};

module.exports = rsa;