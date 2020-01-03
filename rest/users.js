var express = require('express');
var router = express.Router();
var User = require('../models/users');

//get all users
router.get('/', (req, res, next) => {
	console.log(req.user);
	User.find({}, (err, users) => {
		if (err) return next(err);
		res.json(users);
	});
});

//add a user
router.post('/', (req, res, next) => {
	var newUser = req.body;

	if ( newUser.username == undefined || newUser.password == undefined|| newUser.role == undefined){
		return res.status(400).send("missing required field(s)");
	}

	new User(newUser).save((err, user) => {
		if (err) return next(err);
		res.json(user);
	})
});

module.exports = router;
