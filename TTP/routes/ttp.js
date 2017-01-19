var express = require('express');
var router = express.Router();
var uuidV1 = require('uuid/v1');
var rsa = require('./keys/rsa-ttp');
var bignum = require('bignum');
var CryptoJS = require('crypto-js');
var request = require('request');
var Records = require('../../models/modelTTP');
var moment = require('moment')



function signPrivateKey (data,d,n){
    return data.powm(d,n);
}

function checkSignature (signed,e,n){
    return signed.powm(e,n);
}


//TTP
router.post('/ttp', function(req, res) {

    console.log('********4-RECEIVING FROM ANONA....********');
    console.log(req.body);


    var A = req.body.A;
    var B = req.body.B;

    var proofOrigin = req.body.proof_origin;
    var pubk_A_n = req.body.cert_n;
    var pubk_A_e = req.body.cert_e;
    console.log(req.body.cert_n);
    console.log(req.body.cert_e);

    var pO = bignum(proofOrigin,16);

    var decryptSignature = checkSignature(pO,pubk_A_e,pubk_A_n);
    console.log(decryptSignature);
    var hashFromServer = decryptSignature.toString(16);
    console.log('PROOF SERVER: '+hashFromServer);
    var concat = A.concat('-',B,'-',req.body.product_name,'-',req.body.product_price,'-',req.body.product_office,'-',req.body.transactionid);
    console.log(concat);
    var hashToCompare = CryptoJS.MD5(concat);
    console.log('HASH TO COMPARE: '+hashToCompare);

    if(hashFromServer == hashToCompare)
    {   console.log('CORRECT VERIFICATION');
        //DATABASE RECORD
        Records.create({
            id_transaction: req.body.transactionid,
            product_name: req.body.product_name,
            amount: req.body.product_price,
            vendor: req.body.B,
            buyer: req.body.A
        }, function(err) {
            if (err)
                res.send(err);
        });
        //----------------------------------------------------


        var publicTTP = rsa.publicKeyTTP();
        var n_ttp = publicTTP.n;
        var e_ttp = publicTTP.e;

        var res_concat = A.concat('-',B,'-',req.body.product_name,'-',req.body.product_price,'-',req.body.product_office,'-',req.body.transactionid);

        var res_Hash = CryptoJS.MD5(res_concat);
        var res_hashBig = bignum(res_Hash.toString(),16);
        var res_porigin =  signPrivateKey(res_hashBig,rsa.privateKeyTTP(),n_ttp);

        var resultTransaction = {
            B:'DEMO_eCOMMERCE',
            A:'ANONA_API',
            transactionid: req.body.transactionid,
            productname: req.body.product_name,
            price: req.body.product_price,
            store: req.body.product_store,
            office: req.body.product_office,
            recivingday: moment().add(3, 'days').calendar(),
            prooforigin: res_porigin.toString(16),
            cert_n: n_ttp.toString(16),
            cert_e: e_ttp.toString(16)
        };

        //RESULT TO ECOMMERCE
        console.log('5-SENDING RESULT TO ECOMMERCE......');
        request.post('http://localhost:3001/result-transaction',{json:resultTransaction}, function (error, response, body) {

            //RESULT TO ANONA API
            console.log('6-SENDING RESULT TO ANONA API......');
            res.send(resultTransaction);

        });


    }else{
        res.status(400).send('INCORRECT VERIFICATION');
    }


});

module.exports = router;
