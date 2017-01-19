var express = require('express');
var router = express.Router();
var bignum = require('bignum');
var uuidV1 = require('uuid/v1');
var moment = require('moment');
var CryptoJS = require('crypto-js');
var rsa = require('./keys/rsa-eC.js');



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

router.get('/ecommerce-cert', function(req, res, next) {

  var publicK = rsa.publicKeyCommerce();
  var publicKey = {n:publicK.n.toString(), e:publicK.e.toString(), cert:publicK.cert};
  console.log(publicKey);


  res.send({ecommerceCert:publicKey});
});


//Recibimos la peticion de anonabank y le mandamos la info de la transaccion con el id de procesamiento y la fecha de envio
router.post('/ecommerce-transaction', function(req, res) {
  console.log(req.body);


  //VERIFICATION PROOF ORIGIN
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
  var concat = A.concat('-',B,'-',req.body.product_name,'-',req.body.product_price,'-',req.body.product_office);
  console.log(concat);
  var hashToCompare = CryptoJS.MD5(concat);
  console.log('HASH TO COMPARE: '+hashToCompare);
  if(hashFromServer == hashToCompare)
  {
    console.log('CORRECT VERIFICATION');

    var transactionID = uuidV1();
    var concatenated = B.concat('-',A,'-',req.body.product_name,'-',req.body.product_price,'-',req.body.product_office,'-',transactionID);
    console.log('CONC: '+concatenated);
    var hash = CryptoJS.MD5(concatenated);
    console.log('OUTPUT: '+ hash);
    var hashBig = bignum(hash.toString(),16);
    var privateK_d = rsa.privateKeyCommerce();
    var publicK = rsa.publicKeyCommerce();
    var proofO =  signPrivateKey(hashBig,privateK_d,publicK.n);
    console.log('HASH BIG-----'+hashBig);
    console.log('N: '+publicK.n);
    console.log('E: '+publicK.e);

    var check = checkSignature(proofO,publicK.e,publicK.n);
    console.log('CHECK-----'+check);

    var transaction = {
     B:'DEMO_eCOMMERCE',
     A:'ANONA_API',
     transactionid: transactionID,
     productname: req.body.product_name,
     price: req.body.product_price,
     store: req.body.product_store,
     office: req.body.product_office,
     recivingday: moment().add(3, 'days').calendar(),
     prooforigin: proofO.toString(16),
     cert_n: publicK.n.toString(),
     cert_e: publicK.e.toString()
     };

    console.log('********2-SENDING TO ANONA....********');
    console.log(transaction);
    res.send(transaction);

  }else{
    res.status(400).send('INCORRECT VERIFICATION');
  }

});


router.post('/result-transaction', function(req, res, next) {

 console.log('TRANSACTION DONE WITH ID: ***'+req.body.transactionid+'*** AND AMOUNT: ****'+req.body.price+'€***');
 console.log('VERIFYING PROOF OF PUBLICATION......');
  console.log(req.body);

  var A = req.body.A;
  var B = req.body.B;

  var proofOrigin = req.body.prooforigin;
  var pubk_A_n = req.body.cert_n;
  var pubk_A_e = req.body.cert_e;
  console.log(req.body.cert_n);
  console.log(req.body.cert_e);

  var pO = bignum(proofOrigin,16);

  var decryptSignature = checkSignature(pO,pubk_A_e,pubk_A_n);
  console.log(decryptSignature);
  var hashFromServer = decryptSignature.toString(16);
  console.log('PROOF SERVER: '+hashFromServer);
  var concat = A.concat('-',B,'-',req.body.productname,'-',req.body.price,'-',req.body.office,'-',req.body.transactionid);
  console.log(concat);
  var hashToCompare = CryptoJS.MD5(concat);
  console.log('HASH TO COMPARE: '+hashToCompare);
  if(hashFromServer == hashToCompare){
    console.log('******************************************************');
    console.log('**********¡¡¡PROOF OF PUBLICATION CORRECT!!!**********');
    console.log('*******************TRANSACTION DONE*******************');
    console.log('******************************************************');
    res.send('OK');
  }else{
    console.log('PROOF OF PUBLICATION INCORRECT');
  }



});

module.exports = router;
