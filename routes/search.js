var _ = require('underscore');
var express = require('express');
var router = express.Router();

var Line = require('../models/lineModel');

/* GET the lines which match the specified params
 * /api/search?querystring
 * querystring can include:
 * @param {string} speaker: the name of the speaker to match for (e.g 'jon' or 'lynn')
 * @param {string} keyword: the keyword to match for in the response bodies
 */
router.get('/', function(req, res, next) {
	var query = {};
	if (req.query.speaker) query.speaker = new RegExp(req.query.speaker, 'i');
	if (req.query.keyword) query.body = new RegExp(req.query.keyword, 'i');

	Line.findSorted(query, function(err, lines) {
		if (err) {
			res.status(500).json(error);
		} else {
			res.status(200).json({
				lines: lines
			});
		}
	});
});

module.exports = router;
