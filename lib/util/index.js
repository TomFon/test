const { once } = require('events');
const { createReadStream, existsSync } = require('fs');
const { createInterface } = require('readline');
const parseUrl = require('./parse-url');
const REG_EXP_RE = /^\/(.+)\/(i)?$/;
const HTTP_PORT_RE = /:80$/;
const HTTPS_PORT_RE = /:443$/;

/**
 * 解析一些字符时，encodeURIComponent可能会抛异常，对这种字符不做任何处理
 * see: http://stackoverflow.com/questions/16868415/encodeuricomponent-throws-an-exception
 * @param ch
 * @returns
 */
function safeEncodeURIComponent(ch) {
	try {
		return encodeURIComponent(ch);
	} catch (e) {}

	return ch;
}
function _getProtocol(isHttps) {
	return isHttps ? 'https://' : 'http://';
}
function hasProtocol(url) {
	return /^[a-z0-9.-]+:\/\//i.test(url);
}
function removeProtocol(url, clear) {
	return hasProtocol(url)
		? url.substring(url.indexOf('://') + (clear ? 3 : 1))
		: url;
}
function getProtocol(url) {
	return hasProtocol(url) ? url.substring(0, url.indexOf('://') + 1) : null;
}
function removeDefaultPort(host, isHttps) {
	return host && host.replace(isHttps ? HTTPS_PORT_RE : HTTP_PORT_RE, '');
}
function getFullUrl(req) {
	let headers = req.headers;
	let host = headers.host;
	if (hasProtocol(req.url)) {
		let options = parseUrl(req.url);
		if (options.protocol === 'https:') {
			req.isHttps = true;
		}
		req.url = options.path;
		if (options.host) {
			if (!host || typeof host !== 'string') {
				host = headers.host = options.host;
			}
		}
	} else {
		req.url = req.url || '/';
		if (req.url[0] !== '/') {
			req.url = '/' + req.url;
		}
		if (typeof host !== 'string') {
			host = headers.host = '';
		}
	}
	host = removeDefaultPort(host, req.isHttps);
	let fullUrl = _getProtocol(req.isHttps) + host + req.url;
	console.log('fullUrl', fullUrl);
	return fullUrl;
}
exports.getFullUrl = getFullUrl;
exports.removeProtocol = removeProtocol;
exports.hasProtocol = hasProtocol;
exports.getProtocol = getProtocol;
// 逐行读取文件
exports.readfileByline = async function readfileByline(filePath) {
	try {
		const result = [];
		if (!existsSync(filePath)) {
			console.log('fulePath is not exists');
			return result;
		}
		const rl = createInterface({
			input: createReadStream(filePath),
			crlfDelay: Infinity
		});

		rl.on('line', (line) => {
			result.push(line);
		});
		await once(rl, 'close');
		return result;
	} catch (err) {
		console.error(err);
	}
};

exports.isRegExp = function (regExp) {
	return REG_EXP_RE.test(regExp);
};

exports.toRegExp = function toRegExp(regExp, ignoreCase) {
	regExp = REG_EXP_RE.test(regExp);
	try {
		regExp = regExp && new RegExp(RegExp.$1, ignoreCase ? 'i' : RegExp.$2);
	} catch (e) {
		regExp = null;
	}
	return regExp;
};
