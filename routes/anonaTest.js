/**
 * Created by mbmarkus on 30/12/16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/modeluser');
var CryptoJS = require("crypto-js");


/**
 * Ruta no funcional, solamente para guardar código y sus explicaciones
 */

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
     * Si encriptamos un String estilo 'Hola' --> es codificación Latin-1.
     * Obtendremos un objeto, y para transportarlo le aplicaremos el método .toString()
     * Este nos dara un string de Base64
     * Final: Después de desencriptar se tiene que devolver a Latin-1 (Básico)
     * @type {*}
     */

    /**
     * Inicio: Obtenemos un String aleatorio y lo convertimos en HEX
     *
     * 2. Encriptaremos el objeto HEX y obtenemos un objeto WordArray de CryptoJS
     * 3. Transformamos el objeto con .toString para poderlo transportarlo.
     * 4. Este se transforma en un String con codificación Base64.
     * 5. Al encriptar por segunda vez, el cipher ya entiende la codificación en 64
     * y la transforma internamente, obteniendo la segunda encriptación
     *
     * Resultado: String con codificación de Base 64
     * * @type {*}
     */


        //Ciframos la kcoin con el password
    var encrypted = CryptoJS.AES.encrypt(kcoin, req.body.password);
    var e1 = encrypted.toString();
    console.log("E1 to String (Base64): " + e1);

    //Ciframos con el PIN del usuario
    //Aplicamos el mismo proceso anterior otra vez

    var encrypted2 = CryptoJS.AES.encrypt(e1, 'Pin');
    var e2 = encrypted2.toString();
    console.log("E2 to String (Base64): " + e2);

    /**
     * Decrypt
     *
     * Inicio: String con codificación de Base 64
     *
     * 2. Desencriptamos con la misma Base64 (autocodificación como el caso de la encriptación).
     * No hace falta revertir el .toString()
     * 3. La salida de desencriptar es un string en UTF_8 de CryptoJS. Así pues aplicamos:
     * .toString(CryptoJS.enc.Utf8);
     * Para volver ciphertext del paso 1, es decir, la kcoin cifrada por la password
     * 4. Por último, desencriptamos en una base númerica desconocida (Latin1?)
     * 5. Aplicamos: .toString(CryptoJS.enc.Latin1) para obtener nuestro kcoin Hexadecimal
     *
     * @type {*}
     */

    var decrypted = CryptoJS.AES.decrypt(e2, 'Pin');
    console.log("Salida en (UTF-8): " + decrypted);
    var dec = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Post UTF-8 (Base64): " + dec);

    //Segundo
    var decrypted2 = CryptoJS.AES.decrypt(dec, req.body.password);
    console.log("Salida sin mod DecPass: " + decrypted2);
    console.log('Final:'+ decrypted2.toString(CryptoJS.enc.Latin1));

    //Creamos la información en el modelo user
    var newUser = new User({
        username: username,
        password: password
    });

    User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
        res.send(user);
    });
});