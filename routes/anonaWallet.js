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


module.exports = router;