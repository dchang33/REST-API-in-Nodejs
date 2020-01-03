'use strict';

const mongoose = require('mongoose');
const User = require('./users');
const Program = require('./programs');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
	},
	location: {
		type: String,
		required: true
	},
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		required: true
	},
	status: {
		type: String,
		enum: ['SUBMITTED', 'POSTED', 'REJECTED'],
		default: 'SUBMITTED',
		required: true
	},
	tag: [String],
	organizer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	attendees:[{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = mongoose.model('Event', eventSchema);
