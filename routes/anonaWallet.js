/**
 * Created by irkalla on 06.12.16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/modeluser');
var Temporary = require('../models/modeltemporary')


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
        res.send(tempo);
    });

});


/* GET encrypted coins from a user. */
router.get('/', function(req, res, next) {
    //después del login

    res.send('respond with a resource');
});




module.exports = router;