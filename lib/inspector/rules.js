const util = require('../util');

module.exports = function (req, res, next) {
	req.fullUrl = util.getFullUrl(req);
	next();
};
