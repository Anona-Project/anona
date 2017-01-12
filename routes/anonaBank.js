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

/*Checking the coins in the blacklist and payment*/
router.post('/pay', function(req, res) {
    //Geting de request data
    var coins = req.body.coins;
    var product = req.body.product;
    var office = req.body.office;
    var price = req.body.price;
    var store = req.body.store;

    console.log(coins);
    console.log(product);
    console.log(office);
    console.log(price);

    //Cheking the validation of the coins
    for (var i = 0; i < coins.length; i++){
        var e = 0;
        var invalidcoinfound = false;
        console.log('estoy dentro del for');
        var coin = coins[i];
        console.log('moneda: ',coin);
        var signedId = coin.ID_signed;
        console.log('ID firmado: ',signedId);
        //Aqui debemos mirar si el signed id es correcto



        //Una vez sabemos que el signed ID es correcto en todas las monedas comprovamos si estan en la blacklist
        var query = {idsigned: signedId};
        Coins.findOne(query, function (err, foundcoin) {
            if(foundcoin){
                i = -1;
                res.status(400).send('Invalid coins found');
            }
            else{
                console.log('coinsarevalid');
            }
        });
        if (i = -1){
            break;
        }
    }
    //We add the coins to the blacklist if this are valid
    if (i = price-1) {
        console.log('i value:', i);
        for (var a = 0; coins.length; a++) {
            var addcoin = coins[i];
            console.log('coin toadd', addcoin);
            Coins.create({
                id: addcoin.ID,
                idsigned: addcoin.ID_signed,
                amount: addcoin.amount,
                issuer: addcoin.issuer,
                issuedate: addcoin.issue_date,
                urlcheck: addcoin.URLcheck,
                urlcert: addcoin.URLcert
            },function (err, coin) {
                if(coin){
                    console.log('coin added to the list');
                }else{
                    console.log("Error adding")
                }
            });
        }
    }
    else{
        res.status(400).send('Invalid coins found');
    }

    res.send('success');
});





module.exports = router;