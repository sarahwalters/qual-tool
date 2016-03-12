var mongoose = require('mongoose');
var q = require('promise');
var _ = require('underscore');
var fileUtil = require('../utils/fileUtil');
var Line = require('./lineModel');

var fileSchema = mongoose.Schema({
	filename: String,
	lineIds: [String] // array of line _ids
});

fileSchema.statics.findOneOrCreate = function (filename, callback) {
	var self = this;

    self.findOne({filename: filename}, function(err, foundFile) {
    	if (err || foundFile) {
    		callback(err, foundFile);
    	} else {
    		var filepath = fileUtil.path(filename);
    		fileUtil.readAndParse(filepath, function(err, parsedFile) {
    			if (err) {
    				callback(err, null);
    			} else {
    				// Save the line objects to db
	    			var saveLinePromises = _.map(parsedFile, function(aLine) {
	    				return new q(function(resolve, reject) {
							new Line(aLine).save(function(err, savedLine) {
								if (err) {
									reject(err);
								} else {
									resolve(savedLine._id);
								}
	    					});
	    				});
    				});

    				// When done saving line objects, save the file object to db
					q.all(saveLinePromises)
					 .then(function(savedLineIds) {
					 	new self({
					 		filename: filename,
					 		lineIds: savedLineIds
					 	}).save(function(err, savedFile) {
					 		callback(err, savedFile);
					 	});
					 });
    			}

    		});
    	}
    });
};

module.exports = mongoose.model('File', fileSchema)
