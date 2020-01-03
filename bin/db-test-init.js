require('dotenv').config();
//mongoose init data
const mongoose = require('mongoose');


const User = require('../models/users');
const Event = require('../models/events');
const Program = require('../models/programs');

var programs = [{
	_id: new mongoose.Types.ObjectId(),
	name: 'FYrE@ECST',
	fullname: 'First-Year Experience Program at ECST',
	description: 'Sharing first year Experience to the others'
}];


var users = [
	{
		_id: new mongoose.Types.ObjectId(),
		username: 'Admin',
		password: 'admin',
		role: 'ADMIN',
	},
	{
		_id: new mongoose.Types.ObjectId(),
		username: 'Lobster',
		password: 'Yummy',
		role: 'USER'
	}
];

var events = [
	{
		_id: new mongoose.Types.ObjectId(),
		name: 'Orientation',
		location: 'Golden Eagle Ball Room',
		startTime: new Date(2018, 10, 1),
		endTime: new Date(2018, 10, 1),
		status: 'POSTED',
		organizer: users[0]._id,
		attendees: [users[1]._id]
	},
	{
		_id: new mongoose.Types.ObjectId(),
		name : 'Faculty Training',
		location: 'Library B113',
		startTime: new Date(2018, 10, 1),
		endTime: new Date(2018, 10, 1),
		status: 'SUBMITTED',
		organizer: users[1]._id,
		attendees:[users[0]._id]
	}
];

async function run(){
	await mongoose.connect('mongodb://localhost/cafe');

	await User.deleteMany({});
	await Event.deleteMany({});
	await Program.deleteMany({});

	for (var program of programs){
		await new Program(program).save();
		console.log('Program saved');
	}

	for (var user of users){
		await new User(user).save();
		console.log('User saved');
	}

	for (var event of events){
		await new Event(event).save();
		console.log('Event saved');
	}

	await mongoose.disconnect();
}


run();
