/**
 * Created by tonimas on 6/12/16.
 */
var keys = require('./bank');
var bignum = require('bignum');
var coinkeys = require('./coins');

var rsa ={

    publicKeybank: function() {
        return {cert: 'Anona-Bank ROOT Test X.509 Certificate',e:keys.publicKey.e,n:keys.publicKey.n};

    },
    privateKeybank: function() {

    },
    publicKeycoins: function() {
        return {cert: 'Anona-Bank 1Coin Test X.509 Certificate',e:coinkeys.publicKey.e,n:coinkeys.publicKey.n};
    },
    privateKeycoins: function() {

    }

};

//-------------- BANK rsa functions -------------------//
rsa.publicKeybank.prototype = {
    encrypt: function(m) {
        return m.powm(keys.publicKey.e, keys.publicKey.n);
    },
    verify: function(c) {
        return c.powm(keys.publicKey.e, keys.publicKey.n);
    }
};

rsa.privateKeybank.prototype = {
    sign: function(m) {
        return m.powm(keys.privateKey.d, keys.publicKey.n);
    },
    decrypt: function(c) {
        return c.powm(keys.privateKey.d, keys.publicKey.n);
    }
};

//--- Coin rsa functions -------------//
rsa.publicKeycoins.prototype = {
    encrypt: function(m) {
        return m.powm(coinkeys.publicKey.e, coinkeys.publicKey.n);
    },
    verify: function(c) {
        return c.powm(coinkeys.publicKey.e, coinkeys.publicKey.n);
    }
};

rsa.privateKeycoins.prototype = {
    sign: function(m) {
        return m.powm(coinkeys.privateKey.d, coinkeys.publicKey.n);
    },
    decrypt: function(c) {
        return c.powm(coinkeys.privateKey.d, coinkeys.publicKey.n);
    }
};

module.exports = rsa;