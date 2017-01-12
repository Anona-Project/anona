/**
 * Created by irkalla on 06.12.16.
 */
var express = require('express');
var router = express.Router();
var Temporary = require('../models/modeltemporary');
var User = require('../models/modeluser');


/* POST money to a temporary state. */
router.post('/temporary', function(req, res) {
    console.log(req.body.ecoins);
    Temporary.create({
        id:req.body.id,
        ecoins: req.body.ecoins
    }, function(err) {
        if (err)
            res.send(err);
    });

    res.send(req.body.id);
});

router.get('/temporary/:id', function(req, res) {
    console.log(req.params.id);
    Temporary.find({id : req.params.id}, function(err, tempo){
        if(err)
            res.send(err)
        Temporary.remove({ id: req.params.id }, function(err) {
        });
        res.send(tempo);
    });
});

//El ID de referencia al pack de monedas temporales, no el _id de Mongoose
router.delete('/temporary/:id', function(req, res) {
    console.log(req.params.id);
    Temporary.remove({
        id : req.params.id
    }, function(err, sub) {
        if (err)
            res.send(err);
    });
    res.sendStatus(200);
});


/* GET encrypted coins from a user. */
router.get('/', function(req, res, next) {
    //después del login

    res.send('respond with a resource');
});

/* POST coin to wallet. */
router.post('/coin/', function(req, res) {
    console.log("Coin String:" +req.body.string);
    console.log("User id:" + req.body.userid);

        var query = {_id : req.body.userid};
        var update = {$push : {"coins" : req.body.string}};
        var options = {};

        User.findOneAndUpdate(query, update, options, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.send(user);
        });
});

/* Check money in the wallet when pay */
/* POST coin to wallet. */
router.post('/checkmoney', function(req, res) {
    var id = req.body.userid;
    var price = req.body.price;
    console.log("user id:", id);
    console.log("price:", price);

    User.findById(id, function(err, user) {
        if (err) {
            res.status(400).send('Some went worng');
        }
        if(user){
            console.log('Estoy en dentro del user encontrado', user);
           var balance = user.coins.length;
            console.log('Balance', balance);
            var x = parseInt(balance);
            var z = parseInt(price);
            console.log('Balance parseado', x);
            console.log('Prceio parseado', z);
            if(x >= z){
                console.log('Estoy en el if comparador')
                var i = parseInt(price);
                console.log('var i', i);
                var coins = user.coins.slice(0, i);
                console.log('coins',coins);
                res.send(coins);
            }
            else{
                res.status(400).send('Not enough money in your wallet');
            }
        }

    });
    /* Get coins*/
    /* GET encrypted coins from a user. */
    router.get('/coins/:', function(req, res, next) {


        res.send('respond with a resource');
    });
});

module.exports = router;