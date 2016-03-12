var q = require('promise');
var _ = require('underscore');
var express = require('express');
var router = express.Router();

var fileUtil = require('../utils/fileUtil');
var File = require('../models/fileModel');
var Line = require('../models/lineModel');

/* GET the full text of a file, in parsed format.
 * /api/read/:filename
 * @param {string} filename: the name of a file in the data folder -- e.g. "jon-1"
 */
router.get('/:filename', function(req, res, next) {
	File.findOneOrCreate(req.params.filename, function(err, file) {
		if (err) {
			res.status(err.code).json({
				error: err.msg
			});
		} else {
			// Read lines from db by id
			var readLinePromises = _.map(file.lineIds, function(aLineId) {
				return new q(function(resolve, reject) {
					Line.findById(aLineId, function(err, line) {
						if (err) {
							reject(err);
						} else {
							resolve(line);
						}
					});
				});
			});

			// When done reading all lines, construct and send response
			q.all(readLinePromises)
			 .then(function(lines) {
			 	res.status(200).json({
			 		_id: file._id,
					filename: file.filename,
					lines: lines
				});
			 });
		}
	});
});

/* GET a specific line from a file, in parsed format.
 * /api/read/:filename/:line
 * @param {string} filename: the name of a file in the data folder -- e.g. "jon-1"
 * @param {integer} line: an integer line number, one-indexed
 */
router.get('/:filename/:line', function(req, res, next) {
	var lineNumber = parseInt(req.params.line) - 1; // one-index instead of zero-index

	File.findOneOrCreate(req.params.filename, function (err, file) {
		if (err) {
			// Error upstream
			return res.status(err.code).json({
				error: err.msg
			});
		} else if (-1 < lineNumber && lineNumber < file.lineIds.length) {
			// If line number is valid, send line at number
			var lineId = file.lineIds[lineNumber];
			Line.findById(lineId, function(err, line) {
				if (err) {
					res.status(500).json(err);
				} else {
					res.status(200).json({
						line: line
					});
				}
			});
		} else {
			res.status(422).json({
				error: 'line number out of range'
			});
		}
	});
});

module.exports = router;
