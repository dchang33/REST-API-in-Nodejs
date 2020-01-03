var express = require('express');
var passport = require('passport');
var router = express.Router();
var Event = require('../models/events');
var User = require('../models/users');
var jwt = require('jsonwebtoken');


//get all events
router.get('/', (req, res, next) => {
	Event.find({}, (err, events) => {
		if (err) return next(err);
		res.json(events);
	});
});
//get a event by id
router.get('/:e_id', (req, res, next) => {
	try{
		e_id = req.params.e_id;

		Event.find({
			_id: e_id
		}, (err, event) => {
			if(err) return next(err);
			else {
				if (!event){
					res.status(400).send("event not found!!!");
				}
				else {
					res.json(event);
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
//add a new event(admin)
router.post('/', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	var newEvent = req.body;

	if(token) {
		if (newEvent.name == undefined || newEvent.organizer == undefined || newEvent.location == undefined || newEvent.startTime == undefined || newEvent.endTime == undefined){
			return res.status(400).send("Infromation missing");
		}
		new Event(newEvent).save((err, event) =>  {
			if (err) {
				return res.json({message: "Create Event failed"});
			}
			res.json({message: "Created new event"});
		});
	}
	else {
		return res.status(403).send({message: "Unauthenticated User"});
	}
});

//approve or reject the event
router.put('/:eventId', passport.authenticate('jwt', { session: false}), function(req, res) {
	var token = getToken(req.headers);
	var eventId = req.params.eventId;

	if(token) {
		if (checkAccess(token,"ADMIN")) {
			Event.findByIdAndUpdate(eventId, {$set: {status: req.body.status}}, err => {
				if (err) return res.json({message: err});
				res.json("Update Success");
			});
		} else {
			return res.status(403).send({message: "User Unauthorized"});
		}
	} else {
		return res.status(403).send({message: "Token Unauthorized"});
	}
});

//add an attendee
router.put('/:eventId/attendee', passport.authenticate('jwt', { session: false}), function(req, res) {
	var token = getToken(req.headers);
	var eventId = req.params.eventId;

	if(token) {
		if (checkAccess(token,"ADMIN")) {
			Event.findByIdAndUpdate({_id: eventId}, {$addToSet: {attendees: [req.body.attendees]}}, err => {
				if (err) return res.json({message: "err"});
				res.json("Add an attendee");
			});
		} else {
			return res.status(403).send({message: "User Unauthorized"});
		}
	} else {
		return res.status(403).send({message: "Token Unauthorized"});
	}
});

//get all attendees
router.get('/:eventId/attendees', passport.authenticate('jwt', { session: false}), function(req, res) {
	var token = getToken(req.headers);
	var eventId = req.params.eventId;

	if(token) {
		if (checkAccess(token,"ADMIN")) {
			Event.findById(eventId, (err, event) => {
				if (err) {
					res.status(400).send({
						message:  eventId + ': ' + err
					});
				} else if (!event) {
					res.status(404).send({
						message:  eventId + ' not found'
					});
				} else {
					User.find({
						_id: {
							$in: event.attendees
						}
					}, (err, users) => {
						if (err) {
							res.status(500).send({
								message: err
							});
						} else {
							res.json(users);
						}
					});
				}
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
