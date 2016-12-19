/**
 * Created by irkalla on 06.12.16.
 */
var express = require('express');
var router = express.Router();


/* POST encrypted money to a user. */
router.post('/', function(req, res, next) {
    //funcion que guarda el dinero en la cuenta de x persona después de haber introducido el pin en la oficina.

    res.send('respond with a resource');
});


/* GET encrypted coins from a user. */
router.get('/', function(req, res, next) {
    //después del login

    res.send('respond with a resource');
});




module.exports = router;