var fileUtils = {};
var _ = require('underscore');

/* Regexp to match speaker tags.
 * Tags seen so far (comma-separated):
 		MEL-J1, JON 1, DINA, DINA (typing),
 */
fileUtils.speakerRe = /[A-Z0-9]([A-Z0-9- ]|(\(.*\)))*: /g;

// ([A-Z0-9- ]||(\([.*]\)))+:
// ([A-Z0-9- ]|\(.*\))+:

fileUtils.parseSpeakers = function(dataStr) {
	var speakers = dataStr.match(fileUtils.speakerRe);
	var bodies = dataStr.split(fileUtils.speakerRe).slice(1);

	return _.map(speakers, function(aSpeaker, index) {
		var aBody = bodies[3*index + 2]; // only pick out the outer match group

		var cleanedSpeaker = aSpeaker.trim().slice(0,-1); // trim whitespace and colon
		var cleanedBody = aBody.replace(/\n/g, ' ').trim(); // format as single line and trim whitespace

		return {
			speaker: cleanedSpeaker,
			body: cleanedBody
		};
	});
};

module.exports = fileUtils;
