//引入
const readline = require('readline');

const utils = require('../utils');
const { isIP } = require('net');
const protoMgr = require('./protocols');
const WEB_PROTOCOL_RE = /^(?:https?|wss?):\/\//;
const IPV4_RE = /^([\d.]+)(?:\:(\d+))?$/;
const NO_SCHEMA_RE = /^\/\/[^/]/;
const PORT_PATTERN_RE = /^!?:\d{1,5}$/;
const LINE_END_RE = /\n|\r\n|\r/g;
let hostCache = {};
const protocols = protoMgr.protocols;
const aliasProtocols = protoMgr.aliasProtocols;

function getLines(text) {
	if (!text || !(text = text.trim())) {
		return [];
	}
	const result = [];
	const lines = text.split(LINE_END_RE);
	lines.forEach(function (line) {
		line = line.trim();
		if (!line) {
			return;
		}
		result.push(line);
	});
	return result;
}

// 解析host
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
	let result = hostCache[item];
	if (result == null) {
		result = parseHost(item);
	}
	hostCache[item] = result;
	return result;
}

//是否属于pattern
function isPattern(item) {
	return WEB_PROTOCOL_RE.test(item) || utils.isRegExp(item);
}

// list中寻找pattern
function indexOfPattern(list) {
	let ipIndex = -1;
	for (var i = 0, len = list.length; i < len; i++) {
		var item = list[i];
		if (isPattern(item)) {
			return i;
		}

		if (!utils.hasProtocol(item)) {
			if (!isHost(item)) {
				return i;
			} else if (ipIndex === -1) {
				ipIndex = i;
			}
		}
	}
	return ipIndex;
}
// 格式化URL
function formatUrl(pattern) {
	let queryString = '';
	let queryIndex = pattern.indexOf('?');
	if (queryIndex != -1) {
		queryString = pattern.substring(queryIndex);
		pattern = pattern.substring(0, queryIndex);
	}
	let index = pattern.indexOf('://');
	index = pattern.indexOf('/', index == -1 ? 0 : index + 3);
	return (index == -1 ? pattern + '/' : pattern) + queryString;
}
function parseRule(rulesMgr, pattern, matcher, raw) {
	let rawPattern = pattern;
	let isRegExp, port, protocol;

	if (!pattern) {
		return;
	}
	if (
		!isRegExp &&
		(isRegExp = utils.isRegExp(pattern)) &&
		!(pattern = utils.toRegExp(pattern))
	) {
		return;
	}
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
		let index = matcher.indexOf('://');
		let origProto;
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
	let rules = rulesMgr._rules;
	let list = rules[protocol];
	if (!list) {
		protocol = 'rule';
		list = rules.rule;
	} else if (protocol == 'host') {
		let protoIndex = matcher.indexOf(':') + 3;
		let realProto = matcher.substring(0, protoIndex);
		let opts = isHost(matcher.substring(protoIndex));
		if (opts) {
			matcher = realProto + opts.host;
			port = opts.port;
		}
	}
	let rule = {
		name: protocol,
		isRegExp: isRegExp,
		protocol: isRegExp ? null : utils.getProtocol(pattern),
		pattern: isRegExp ? pattern : formatUrl(pattern),
		matcher: matcher,
		port: port,
		raw: raw,
		isDomain:
			!isRegExp &&
			utils.removeProtocol(rawPattern, true).indexOf('/') == -1,
		rawPattern: rawPattern
	};
	list.push(rule);
}

function parseText(rulesMgr, rawRules) {
	rawRules = getLines(rawRules);
	if (rawRules.length === 0) {
		return rawRules;
	}
	rawRules.forEach(function (line) {
		line = line.trim().replace(/\s+/g, ' ');
		if (line.indexOf('#') != 0 && line != '') {
			const raw = line;
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
					if (isPattern(p) || isHost(p) || !utils.hasProtocol()) {
						return true;
					}
					opList.push(p);
				});
				opList.forEach(function (matcher) {
					patternList.forEach(function (pattern) {
						parseRule(rulesMgr, pattern, matcher, raw);
					});
				});
			} else {
				matchers.forEach(function (matcher) {
					parseRule(rulesMgr, pattern, matcher, raw);
				});
			}
		}
	});
	hostCache = {};
}
function Rules() {
	this._rules = protoMgr.getRules();
}

const proto = Rules.prototype;

proto.parse = function (rawRules) {
	parseText(this, rawRules);
	console.log(this._rules.host);
	console.log(this._rules.rule);
};
module.exports = Rules;
