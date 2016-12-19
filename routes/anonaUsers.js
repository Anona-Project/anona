var express = require('express');
var router = express.Router();
var User = require('../models/modeluser');

//Register api call
router.post('/signup', function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

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

//Login api call
router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.getUserByUsername(username, function(err, user){
    console.log('este el usuario encontrado' + user);
    if(err) throw err;
    if(!user){
      console.log('No encontrado');
      res.send('user not found');
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        res.send(user._id);
      } else {
        res.send('invalid camps');
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
