//引入
const readline = require('readline');
const { join } = require('path');
const { readfileByline, isRegExp, hasProtocol } = require('../utils');
const { URL } = require('url');
const { isIP } = require('net');
const WEB_PROTOCOL_RE = /^(?:https?|wss?):\/\//;
const IPV4_RE = /^([\d.]+)(?:\:(\d+))?$/;
const hostCache = {};
// pattern ip regExp hostname
// matcher  protocol hostname

// ip : hostname·
// regExp : protocol or hostname
// hostname : hostname

// 解析ip
function parseHost(item) {
	let port;
	if (IPV4_RE.test(item)) {
		port = RegExp.$2;
		item = RegExp.$1;
		if (!isIP(item)) {
			return false;
		}
	} else if (!isIP(item)) {
		return false;
	}
	return {
		host: item,
		port: port
	};
}
//判断是否为ip
function isHost(item) {
	var result = hostCache[item];
	if (result == null) {
		result = parseHost(item);
	}
	hostCache[item] = result;
	return result;
}

function isPattern(item) {
	return WEB_PROTOCOL_RE.test(item) || isRegExp(item);
}

function indexOfPattern(list) {
	let ipIndex = -1;
	for (var i = 0, len = list.length; i < len; i++) {
		var item = list[i];
		if (isPattern(item)) {
			return i;
		}

		if (!hasProtocol(item)) {
			if (!isHost(item)) {
				return i;
			} else if (ipIndex === -1) {
				ipIndex = i;
			}
		}
	}
	return ipIndex;
}

async function parseText(rawRules) {
	if (rawRules.length === 0) {
		return rawRules;
	}
	rawRules = rawRules.forEach(function (line) {
		line = line.trim().replace(/\s+/g, ' ');
		if (line.indexOf('#') != 0 && line != '') {
			line = line.split(' ');
			const length = line.length;
			if (length <= 1) {
				return;
			}
			const patternIndex = indexOfPattern(line);
			const pattern = line[0];
			const matchers = line.slice(1);

			//console.log(line, patternIndex);
			// 找不到pattern
			if (patternIndex === -1) {
				return;
			}
			if (patternIndex > 0) {
				const opList = [pattern];
				// 过滤matchers
				const patternList = matchers.filter(function (p) {
					if (isPattern(p) || isHost(p) || !hasProtocol()) {
						return true;
					}
					opList.push(p);
				});
				console.log(patternList, 'patternList');
				console.log(opList, 'opList');
			}
		}
	});

	return [];
}
exports.getRules = async function () {
	try {
		const rawRules = await readfileByline(
			join(process.cwd(), 'proxyConfig')
		);
		const rules = await parseText(rawRules);
		return rules;
	} catch (err) {
		console.log(err);
	}
};
