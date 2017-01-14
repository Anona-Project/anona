var express = require('express');
var router = express.Router();
var uuidV1 = require('uuid/v1');
var moment = require('moment');

//Recibimos la peticion de anonabank y le mandamos la info de la transaccion con el id de procesamiento y la fecha de envio
router.post('/transaction', function(req, res) {
  console.log(req.body);
  var transaction = {
    transactionid: uuidV1(),
    productname: req.body.productname,
    price: req.body.price,
    store: req.body.store,
    office: req.body.office,
    recivingday: moment().add(3, 'days').calendar()
  };
  console.log(transaction);
  res.send(transaction);
});

module.exports = router;
