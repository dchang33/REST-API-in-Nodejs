var express = require('express');
var passport = require('passport');
var router = express.Router();
var Program = require('../models/programs');
var User = require('../models/users');
var jwt = require('jsonwebtoken');

//get all programs
router.get('/', (req, res, next) => {
	Program.find({}, (err, programs) => {
		if (err) return next(err);
		res.json(programs);
	});
});

//get a program by id
router.get('/:p_id', (req, res, next) => {
	try{
		p_id = req.params.p_id;

		Program.find({
			_id: p_id
		}, (err, program) => {
			if(err) return next(err);
			else {
				if (program.length<1){
					res.status(400).send("Program not found!!!");
				}
				else {
					res.json(program);
				}
			}
		});
	}
	catch (err){
		res.status(500).send({
			message: err
		});
	}
});

//create program(admin)
router.post('/', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token) {
		if (checkAccess(token,"ADMIN")) {
			var newProgram = new Program({
				name: req.body.name,
				fullname: req.body.fullname
			});
			newProgram.save(function(err) {
				if (err) {
					return res.json({message: "Create Program failed"});
				}
				res.json({success: "Prgram created"});
			});
		}
		else {
			return res.status(403).send({message: "User Unauthorized"});
		}
	}
	else {
		return res.status(403).send({message: "Token Unauthorized"});
	}
});


router.put('/:p_id', passport.authenticate('jwt', { session: false}), function(req, res){
	var token = getToken(req.headers);
	if(token) {
		if (checkAccess(token,"ADMIN")) {
			var p_id = req.params.p_id;
			Program.findByIdAndUpdate(p_id, {$set: req.body}, (err, program) => {
				if (err) return res.json({message: "err"});
				else res.json("Program updated");
			});
		} else {
			return res.status(403).send({message: "User Unauthorized"});
		}
	} else {
		return res.status(403).send({message: "Token Unauthorized"});
	}
});

getToken = function (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

function checkAccess (jsonwebtoken,role){
	decoded = jwt.decode(jsonwebtoken)
	if(decoded['role']==role)
		return true;
}

module.exports = router;
