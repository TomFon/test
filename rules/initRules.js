//引入
const readline = require('readline');
const { join } = require('path');
const { readfileByline, isRegExp, hasProtocol, toRegExp } = require('../utils');
const { URL } = require('url');
const { isIP } = require('net');
const protoMgr = require('./protocols');
const WEB_PROTOCOL_RE = /^(?:https?|wss?):\/\//;
const IPV4_RE = /^([\d.]+)(?:\:(\d+))?$/;
const NO_SCHEMA_RE = /^\/\/[^/]/;
const PORT_PATTERN_RE = /^!?:\d{1,5}$/;
const hostCache = {};
const protocols = protoMgr.protocols;
const aliasProtocols = protoMgr.aliasProtocols;
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
function formatUrl(pattern) {
	var queryString = '';
	var queryIndex = pattern.indexOf('?');
	if (queryIndex != -1) {
		queryString = pattern.substring(queryIndex);
		pattern = pattern.substring(0, queryIndex);
	}
	var index = pattern.indexOf('://');
	index = pattern.indexOf('/', index == -1 ? 0 : index + 3);
	return (index == -1 ? pattern + '/' : pattern) + queryString;
}
function parseRule(rulesMgr, pattern, matcher, raw, root, options) {
	let rawPattern = pattern;
	let noSchema;
	let isRegExp, not, port, protocol, isExact;

	if (!pattern) {
		return;
	}
	if (
		!isRegExp &&
		(isRegExp = isRegExp(pattern)) &&
		!(pattern = toRegExp(pattern))
	) {
		return;
	}
	var proxyName, isRules, statusCode;
	if (isHost(matcher)) {
		matcher = 'host://' + matcher;
		protocol = 'host';
	} else if (matcher[0] === '/') {
		if (matcher[1] === '/') {
			protocol = 'rule';
		} else {
			matcher = 'file://' + matcher;
			protocol = 'file';
		}
	} else {
		var index = matcher.indexOf('://');
		var origProto;
		if (index !== -1) {
			origProto = matcher.substring(0, index);
			protocol = aliasProtocols[origProto];
		}
		if (!protocol) {
			protocol = origProto;
			if (matcher === 'host://') {
				matcher = 'host://127.0.0.1';
			}
		}
	}
	var rules = rulesMgr._rules;
	var list = rules[protocol];
	if (!list) {
		protocol = 'rule';
		list = rules.rule;
	} else if (protocol == 'host') {
		var protoIndex = matcher.indexOf(':') + 3;
		var realProto = matcher.substring(0, protoIndex);
		var opts = isHost(matcher.substring(protoIndex));
		if (opts) {
			matcher = realProto + opts.host;
			port = opts.port;
		}
	}
	var rule = {
		name: protocol,
		isRegExp: isRegExp,
		protocol: isRegExp ? null : getProtocol(pattern),
		pattern: isRegExp ? pattern : formatUrl(pattern),
		matcher: matcher,
		port: port,
		raw: raw,
		isDomain:
			!isRegExp &&
			!not &&
			(noSchema
				? pattern
				: util.removeProtocol(rawPattern, true)
			).indexOf('/') == -1,
		rawPattern: rawPattern
	};
	list.push(rule);
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
