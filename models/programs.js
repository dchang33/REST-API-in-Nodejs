'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let programSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	fullname: {
		type: String,
		required: true
	},
	description:{
		type: String
	}
});

module.exports = mongoose.model('Program', programSchema);
