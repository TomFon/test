const { once } = require('events');
const { createReadStream, existsSync } = require('fs');
const { createInterface } = require('readline');
const REG_EXP_RE = /^\/(.+)\/(i)?$/;
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

function hasProtocol(url) {
	return /^[a-z0-9.-]+:\/\//i.test(url);
}
function removeProtocol(url, clear) {
	return hasProtocol(url)
		? url.substring(url.indexOf('://') + (clear ? 3 : 1))
		: url;
}
exports.removeProtocol = removeProtocol;
exports.hasProtocol = hasProtocol;
