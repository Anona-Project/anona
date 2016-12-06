var express = require('express');
var router = express.Router();
var rsa = require('./keys/rsa');
var bignum = require('bignum');
var CryptoJS = require('crypto-js');


router.get('/bankcertificate', function(req, res, next) {

   var publicK = rsa.publicKeybank();
   var publicKey = {n:publicK.n.toString(), e:publicK.e.toString(), cert:publicK.cert, length:2048};

   res.send({BankPublicKey:publicKey});
});

router.get('/e-coincertificate', function(req, res, next) {
    var publicK = rsa.publicKeycoins();
    var publicKey = {n:publicK.n.toString(), e:publicK.e.toString(),cert:publicK.cert,length:1024};

    res.send({EcoinPublicKey:publicKey});
});

//Se llama desde terminal para emitir moneda. Probablmente se reciba el amount y se autentique a la terminal (sino podria emitir moenda la vecina del quinto). Seguidamente se devuelve un json con todas las monedas
router.get('/issue', function(req, res, next) {

});

router.get('/makepayment', function(req, res, next) {
    //gets the coins from the user App to pay, with the info of the transaction
    //check if the signature is correct in each of them
    //check if each coin is valid. If it is, include it in the 'SPENT COINS LIST' AND MAKE THE TRANSACTION TO THE E-COMMERCE

});




module.exports = router;