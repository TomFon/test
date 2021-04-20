const parse = require('url').parse;

const URL_RE = /^([a-z0-9.+-]+:)\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i;
const HOST_RE = /^(.+)(?::(\d*))$/;
const BRACKET_RE = /^\[|\]$/g;

module.exports = function (url) {
	if (!URL_RE.test(url)) {
		return parse(url);
	}
	let protocol = RegExp.$1;
	let host = RegExp.$2;
	let pathname = RegExp.$3 || '/';
	let search = RegExp.$4;
	let hash = RegExp.$5 || null;
	let port = null;
	let hostname = host;
	if (HOST_RE.test(host)) {
		hostname = RegExp.$1;
		port = RegExp.$2;
	}

	return {
		protocol: protocol,
		slashes: true,
		auth: null,
		host: host,
		port: port,
		hostname: hostname.replace(BRACKET_RE, ''),
		hash: hash,
		search: search || null,
		query: search ? search.substring(1) : null,
		pathname: pathname,
		path: pathname + search,
		href: url
	};
};
