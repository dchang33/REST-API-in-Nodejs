var express = require('express');
var router = express.Router();

const Program = require('../models/programs');

//get all programs web page render
router.get('/', function(req, res, next){
	Program.find((err, programs) => {
		res.render('programs', {title: 'Programs', programs: programs});
	});
});

module.exports = router;
