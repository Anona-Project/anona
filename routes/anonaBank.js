var express = require('express');
var router = express.Router();
var rsa = require('./keys/rsa');
var bignum = require('bignum');
var uuidV4 = require('uuid/v4');
var CryptoJS = require('crypto-js');
var Coins = require('../models/modelcoins');
var request = require('request');

var PUBLICKEY = rsa.publicKeycoins();
var PUBLICKEY_E = PUBLICKEY.e;
var PUBLICKEY_N = PUBLICKEY.n;

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

function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

function hexToAscii(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function checkSignature (signed,e,n){
    return signed.powm(e,n);
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
//gets the coins from the user App to pay, with the info of the transaction
//check if the signature is correct in each of them
//check if each coin is valid. If it is, include it in the 'SPENT COINS LIST' AND MAKE THE TRANSACTION TO THE E-COMMERCE

router.post('/pay', function(req, res) {
    //Geting de request data
    var coins = req.body.coins;
    var product = req.body.product;
    var office = req.body.office;
    var price = req.body.price;
    var store = req.body.store;
    var i = 0;
    var a = 0;

    //Cheking the validation of the coins
    var areCoinsValid = function (callback) {
        coins.forEach(function (coin) {
            var signedId = coin.ID_signed;
            var id = coin.ID;
            //Aqui debemos mirar si el signed id es correcto
            var signedIdInt = bignum(signedId, 16);
            console.log('signedidint', signedIdInt);
            console.log('PUBLICKEY_E', PUBLICKEY_E);
            console.log('PUBLICKEY_N', PUBLICKEY_N);
            var checkSignature = signedIdInt.powm(PUBLICKEY_E, PUBLICKEY_N);  //checkSignature(signedIdInt,PUBLICKEY_E,PUBLICKEY_N);
            console.log('checkSignature', checkSignature);
            var checkHex = checkSignature.toString(16);
            console.log('checkHex', checkHex);
            var verify = hexToAscii(checkHex);
            console.log('verify', verify);
            console.log('CoinID', id);

            if (verify == id){
                //Una vez sabemos que el signed ID es correcto en todas las monedas comprobamos si estan en la blacklist
                var query = {idsigned: signedId};
                Coins.findOne(query, function (err, foundcoin) {
                    if(foundcoin){
                        i ++;
                        a = 1;
                        console.log('coins are invalid');
                        if (i == price && a == 1) {
                            console.log('coins are invalid if dentro a !=0');
                            callback(false);
                        }
                    }
                    else{
                        i ++;
                        console.log('coinsarevalid', i);
                        if (i == price && a == 0){
                            console.log('estoy en el if i',i);
                            callback(true);
                        }
                        if (i == price && a == 1) {
                            console.log('coins are invalid if dentro a !=0');
                            callback(false);
                        }
                    }
                });
            }else{
                i ++;
                a = 1;
                if (i == price && a == 1) {
                    console.log('coins are invalid if dentro a !=0');
                    callback(false);
                }
            }
        });
    };

    //We add the coins to the blacklist if this are valid
    var addToList = function (valid) {
        if (valid == true) {
            console.log('estoy en la function callabck');
            var z = 0;
            coins.forEach(function (addcoin) {
                Coins.create({
                    id: addcoin.ID,
                    idsigned: addcoin.ID_signed,
                    amount: addcoin.amount,
                    issuer: addcoin.issuer,
                    issuedate: addcoin.issue_date,
                    urlcheck: addcoin.URLcheck,
                    urlcert: addcoin.URLcert
                }, function (err, coin) {
                    if (coin) {
                        z++;
                        console.log('coin added to the list', z);
                        if (z == price){
                            //We make the post petition to the e-comerce
                            var ecommercejson = {
                                productname: product,
                                price: price,
                                store: store,
                                office: office
                            };


                            //Aqui hacemos la peticion con el ecomerce le mandamos el json ecommercejson y recibimos la respuesta
                            request.post('http://localhost:3001/transaction',{json:ecommercejson}, function (error, response, body) {


                                //Recibimos la respuesta del ecomerce en body y la mandamos la app como res del /pay
                                res.send(body);
                                }
                            );





                        }
                    } else {
                        console.log("Error adding")
                    }
                });
            });
        }if (valid == false){
            res.status(400).send('invalid coins');
        }
    };

    //Executing the function to validate and add the coins to the list
    areCoinsValid(addToList);

});





module.exports = router;