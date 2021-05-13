
module.exports = ['./file-proxy', './http-proxy.js'].map(function (mod) {
	return require(mod);
});
