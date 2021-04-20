const Rules = require('./rules');
const rules = new Rules();
const util = require('../util');
function initRules(req) {
	var fullUrl = req.fullUrl || util.getFullUrl(req);
	req.curUrl = fullUrl;
	req.rules = resolveReqRules(req);
	return req.rules;
}
exports.parse = function (rawRules) {
	rules.parse(rawRules);
};
