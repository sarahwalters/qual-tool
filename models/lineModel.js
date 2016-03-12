var mongoose = require('mongoose');

var lineSchema = mongoose.Schema({
	speaker: String,
	body: String
});

module.exports = mongoose.model('Line', lineSchema);
