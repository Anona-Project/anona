var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



var bank = require('./routes/anonaBank');
var wallet = require('./routes/anonaWallet');
var users = require('./routes/anonaUsers');

var app = express();


//Mongose conection
var database = require('./bin/database');
mongoose.connect(database.url);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/anonabank', bank);
app.use('/anonawallet', wallet);
app.use('/anonausers', users);


module.exports = app;
