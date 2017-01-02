var express = require('express');
var router = express.Router();
var rsa = require('./keys/rsa');
var bignum = require('bignum');
var uuidV4 = require('uuid/v4');
var CryptoJS = require('crypto-js');
var Coins = require('../models/modelcoins');


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

function signPrivateKey (data,d,n){
    return data.powm(d,n);
}

//Se llama desde terminal para emitir moneda
router.post('/issue', function(req, res, next) {

    console.log(JSON.stringify(req.body));
    var info = req.body;
    var issuedCoins = [];
    for(var coin in info){
        if (info.hasOwnProperty(coin)) {
            console.log(info[coin]["BlindCoinID"]);
            var id = info[coin]["BlindCoinID"];
            var idBIG = bignum(id,16);
            console.log('ID BIG: '+idBIG);

            //REVISAR

            var publicK = rsa.publicKeycoins();
            var n = publicK.n;
            var idSigned = signPrivateKey(idBIG,rsa.privateKeycoins(),n);
            issuedCoins.push({signed: idSigned.toString(16), amount: 1});

        }
    }
    res.send({Ecoins:issuedCoins});


});

router.get('/makepayment', function(req, res, next) {
    //gets the coins from the user App to pay, with the info of the transaction
    //check if the signature is correct in each of them
    //check if each coin is valid. If it is, include it in the 'SPENT COINS LIST' AND MAKE THE TRANSACTION TO THE E-COMMERCE

});

/* POST a Coin to Database */
router.post('/coin/', function(req, res) {
    console.log(req.body.coin);
    var newCoin = Coins({
        id: req.body.ID,
        idsigned: req.body.ID_signed,
        amount: req.body.amount,
        issuer: req.body.issuer,
        issuedate: req.body.issue_date,
        urlcheck: req.body.URLcheck,
        urlcert: req.body.URLcert
    });

    Coins.createCoin(newCoin, function(err, coin){
        if(err) throw err;
        res.send(coin);
    });
});






module.exports = router;