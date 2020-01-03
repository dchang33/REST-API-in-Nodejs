'use strict';

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		default: 'USER'
	}
});

module.exports = mongoose.model('User', userSchema);
