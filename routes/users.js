var express = require('express');
var router = express.Router();

const User = require('../models/users');

// get all users
router.get('/', function(req, res, next) {
  User.find( (err, users) => {
     res.render('users', {title: 'Users', users: users});
  });
});

//add user
router.post('/', function(req, res, next){
	User.findById(req.body._id, (err, users) => {
		res.render('users', {title: 'Users', users: users});
	});
});

module.exports = router;
