/**
 * Created by tonimas on 6/12/16.
 */
var keys = require('./bank');
var bignum = require('bignum');
var coinkeys = require('./coins');

var rsa = function () {};

//-------------- BANK rsa functions -------------------//
rsa.publicKey.bank.prototype = {
    encrypt: function(m) {
        return m.powm(this.e, this.n);
    },
    verify: function(c) {
        return c.powm(this.e, this.n);
    }
};

rsa.privateKey.bank.prototype = {
    encrypt: function(m) {
        return m.powm(keys.publicKey.e, keys.publicKey.n);
    },
    verify: function(c) {
        return c.powm(keys.publicKey.e, keys.publicKey.n);
    },
    sign: function(m) {
        return m.powm(keys.privateKey.d, keys.publicKey.n);
    },
    decrypt: function(c) {
        return c.powm(keys.privateKey.d, keys.publicKey.n);
    }
};

//--- Coin rsa functions -------------//
rsa.publicKey.coins.prototype = {
    encrypt: function(m) {
        return m.powm(this.e, this.n);
    },
    verify: function(c) {
        return c.powm(this.e, this.n);
    }
};

rsa.privateKey.coins.prototype = {
    encrypt: function(m) {
        return m.powm(coinkeys.publicKey.e, coinkeys.publicKey.n);
    },
    verify: function(c) {
        return c.powm(coinkeys.publicKey.e, coinkeys.publicKey.n);
    },
    sign: function(m) {
        return m.powm(coinkeys.privateKey.d, coinkeys.publicKey.n);
    },
    decrypt: function(c) {
        return c.powm(coinkeys.privateKey.d, coinkeys.publicKey.n);
    }
};

module.exports = rsa;