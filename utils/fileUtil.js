var fs = require('fs');

var dataUtil = require('./dataUtil');

var fileUtil = {};

fileUtil.dataDir = 'data/';

fileUtil.path = function(filename) {
	return fileUtil.dataDir + filename;
};

fileUtil.readAndParse = function(filepath, callback) {
	fs.readFile(filepath, "utf8", function (error, data) {
		var parsedData = error ? null : dataUtil.parseSpeakers(data);
		var err = error ? {
			code: 422,
			msg: 'Invalid filename'
		} : null;
        callback(err, parsedData);
    });
};

module.exports = fileUtil;
