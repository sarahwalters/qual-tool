var mongoose = require('mongoose');

var lineSchema = mongoose.Schema({
	filename: String,
	lineNumber: Number,
	speaker: String,
	body: String,
});

lineSchema.statics.findSorted = function(query, callback) {
	this.find(query).sort({filename: 1, lineNumber: 1}).exec(callback);
};

module.exports = mongoose.model('Line', lineSchema);
