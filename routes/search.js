var express = require('express');
var router = express.Router();

var Line = require('../models/lineModel');

router.get('/speaker/:name', function(req, res, next) {
	Line.find({speaker: new RegExp(req.params.name, 'i')}, function(err, lines) {
		res.json({
			lines: lines
		});
	});
});

router.get('/body/:keyword', function(req, res, next) {
	Line.find({body: new RegExp(req.params.keyword, 'i')}, function(err, lines) {
		res.json({
			lines: lines
		});
	});
});

router.get('/speaker/:name/body/:keyword', function(req, res, next) {
	var query = {
		speaker: new RegExp(req.params.name, 'i'),
		body: new RegExp(req.params.keyword, 'i')
	};
	Line.find(query, function(err, lines) {
		res.json({
			lines: lines
		});
	});
});

module.exports = router;
