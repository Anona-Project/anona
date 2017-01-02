var express = require('express');
var router = express.Router();
var User = require('../models/modeluser');
var CryptoJS = require("crypto-js");

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


//Register api call
router.post('/signup', function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  //Creamos un clave aleatoria de 128
  var pass = CryptoJS.lib.WordArray.random(256);
  var passString = CryptoJS.enc.Base64.stringify(pass);

  //Convertimos la clave en Hex
  var kcoin = convertToHex(passString);
  console.log(kcoin);

    /**
     * Explicaciones en la ruta anonaTest.js
     * @type {*}
     */

    //Ciframos con el PIN del usuario

    var encrypted = CryptoJS.AES.encrypt(kcoin, req.body.pin);
    var e1 = encrypted.toString();
    console.log("E1 to String (Base64): " + e1);

    //Ciframos la kcoin con el password
    //Aplicamos el mismo proceso anterior otra vez

    var encrypted2 = CryptoJS.AES.encrypt(kcoin, req.body.password);
    var e2 = encrypted2.toString();
    console.log("E2 to String (Base64): " + e2);


    //Creamos la información en el modelo user
    var newUser = new User({
      username: username,
      password: password,
      kcoin: e2
    });

  User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
    res.send(user);
  });
});

//Login api call
router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.getUserByUsername(username, function(err, user){
    console.log('este el usuario encontrado' + user);
    if(err) throw err;
    if(!user){
      console.log('No encontrado');
      res.status(400).send('user not found');
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        res.send(user._id);
      } else {
        res.status(400).send('invalid camps');
      }
    });
  });
});

//GEt user by ID
router.get('/:user_id', function(req, res){
  User.findById(req.params.user_id, (function(err, user){
    if(err)
      res.send(err)
    if(user)
      res.send(user);
  }));
});

module.exports = router;
