const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

Programs = require('./models/programs');
Events = require('./models/events');
const userRoutes = require('./routes/user');
const passport = require('./models/passport');

app.use(passport.initialize());
app.use('/api/', passport.authenticate('jwt', {
	session: false,
	failWithError: true
}));

//Connect to mongoose
mongoose.connect('mongodb://localhost/scicafe');
var db = mongoose.connection;

app.use("/user", userRoutes);

app.get('/',
function(req, res) {
	res.send('Hello World!');
});

app.get('/api/programs', passport.authenticate('jwt', {
	session: false
}),
function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		if (checkAccess(token, "user")) {
			Programs.getPrograms(function(err, programs) {
				if (err) {
					throw err;
				}
				res.json(programs);
			})
		}
	}

});
app.get('/api/programs/:_id',
function(req, res) {
	Programs.getProgramsById(req.params._id,
	function(err, program) {
		if (err) {
			throw err;
		}
		res.json(program);
	})
});
app.post('/api/programs',
function(req, res) {
	var program = req.body;
	Programs.addProgram(program,
	function(err, programs) {
		if (err) {
			throw err;
		}
		res.json(programs);
	})
});
app.put('/api/programs/:_id',
function(req, res) {
	var id = req.params._id;
	var program = req.body;
	Programs.updateProgram(id, program, {},
	function(err, programs) {
		if (err) {
			throw err;
		}
		res.json(programs);
	})
});

app.get('/api/events',
function(req, res) {
	Events.getEvents(function(err, events) {
		if (err) {
			throw err;
		}
		res.json(events);
	})
});
app.post('/api/events',
function(req, res) {
	var event = req.body;
	Events.addEvent(event,
	function(err, events) {
		if (err) {
			throw err;
		}
		res.json(events);
	})
});
app.put('/api/events/:_id',
function(req, res) {
	var id = req.params._id;
	var event = req.body;
	Events.updateEvent(id, event, {},
	function(err, events) {
		if (err) {
			throw err;
		}
		res.json(events);
	})
});
app.listen(3000);
console.log('Running on port 3000...');
