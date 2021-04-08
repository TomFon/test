const Rules = require('./rules');
const rules = new Rules();

exports.parse = function (rawRules) {
	rules.parse(rawRules);
};
