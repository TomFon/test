//引入

const util = require('../util');
const { isIP } = require('net');
const protoMgr = require('./protocols');
const WEB_PROTOCOL_RE = /^(?:https?|wss?):\/\//;
const IPV4_RE = /^([\d.]+)(?:\:(\d+))?$/;
const NO_SCHEMA_RE = /^\/\/[^/]/;
const PORT_PATTERN_RE = /^!?:\d{1,5}$/;
const LINE_END_RE = /\n|\r\n|\r/g;
const QUERY_RE = /[?#].*$/;
let hostCache = {};
const { pureResProtocols, aliasProtocols, protocols } = protoMgr;
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
	return WEB_PROTOCOL_RE.test(item) || util.isRegExp(item);
}

// list中寻找pattern
function indexOfPattern(list) {
	let ipIndex = -1;
	for (let i = 0, len = list.length; i < len; i++) {
		let item = list[i];
		if (isPattern(item)) {
			return i;
		}

		if (!util.hasProtocol(item)) {
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
		(isRegExp = util.isRegExp(pattern)) &&
		!(pattern = util.toRegExp(pattern))
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
		protocol: isRegExp ? null : util.getProtocol(pattern),
		pattern: isRegExp ? pattern : formatUrl(pattern),
		matcher: matcher,
		port: port,
		raw: raw,
		isDomain:
			!isRegExp &&
			util.removeProtocol(rawPattern, true).indexOf('/') == -1,
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
					if (isPattern(p) || isHost(p) || !util.hasProtocol()) {
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
function resolveRules(req, isReq, isRes) {
	let rule;
	let rules = this._rules;
	let _rules = {};
	let vals = this._values;
	let protos = isRes ? pureResProtocols : isReq ? reqProtocols : protocols;
	protos.forEach(function (name) {
		if (
			name !== 'pipe' &&
			(name === 'proxy' || name === 'rule' || name === 'plugin') &&
			(rule = getRule(req, rules[name], vals))
		) {
			_rules[name] = rule;
		}
	});
	multiMatchs.forEach(function (name) {
		if (rule) {
			rule.list = getRuleList(req, rules[name], vals);
			util.filterRepeatPlugin(rule);
			if (name === 'rulesFile' || name === 'resScript') {
				let hasScript,
					scriptIndex = -1;
				rule.list = rule.list.filter(function (item, i) {
					if (item.isRules) {
						return true;
					}
					if (hasScript) {
						return false;
					}
					scriptIndex = i;
					hasScript = true;
					return true;
				});
				rule.scriptIndex = scriptIndex;
				rule.isRawList = true;
			}
		}
	});
	return _rules;
}
function getRule(req, list, vals, index, isFilter) {
	var rule = resolveRuleList(req, list, vals, index || 0, isFilter);
	resolveValue(rule, vals, req);
	return rule;
}
function resolveRuleList(req, list, vals, index, isFilter) {
	var curUrl = formatUrl(req.curUrl);
	var notHttp = list.isRuleProto && curUrl[0] !== 'h';
	//支持域名匹配
	var domainUrl = curUrl.replace(
		/^((?:https?|wss?|tunnel):\/\/[^\/]+):\d*(\/.*)/i,
		'$1$2'
	);
	var isIndex = typeof index === 'number';
	index = isIndex ? index : -1;
	var results = [];
	var url = curUrl.replace(QUERY_RE, '');
	var _domainUrl = domainUrl.replace(QUERY_RE, '');
	var rule, matchedUrl, files, matcher, result, origMatcher, filePath;
	var getPathRule = function () {
		result = extend(
			{
				files:
					files &&
					files.map(function (file) {
						return join(file, filePath);
					}),
				url: join(matcher, filePath)
			},
			rule
		);
		result.matcher = origMatcher;
		removeFilters(result);
		if (isIndex) {
			return result;
		}
		results.push(result);
	};
	var getExactRule = function (relPath) {
		origMatcher = resolveVar(rule, vals, req);
		matcher = setProtocol(origMatcher, curUrl);
		result = extend(
			{
				files: getFiles(matcher),
				url: matcher + relPath
			},
			rule
		);
		result.matcher = origMatcher;
		removeFilters(result);
		if (isIndex) {
			return result;
		}
		results.push(result);
	};
	var checkFilter = function () {
		if (notHttp && protoMgr.isFileProxy(rule.matcher)) {
			return false;
		}
		return isFilter || !matchExcludeFilters(curUrl, rule, req);
	};

	for (var i = 0; (rule = list[i]); i++) {
		// 判断是否为正则,不是正则就为其添加协议头
		var pattern = rule.isRegExp
			? rule.pattern
			: setProtocol(rule.pattern, curUrl);
		var matchedRes;
		if (rule.isRegExp) {
			// 是否匹配当前链接
			matchedRes = pattern.test(curUrl);
			var regExp;
			if (matchedRes) {
				regExp = {};
				for (var j = 1; j < 10; j++) {
					regExp[j] = RegExp['$' + j];
				}
			}
			if (matchedRes && --index < 0) {
				regExp['0'] = curUrl;
				var replaceSubMatcher = function (url) {
					if (!SUB_MATCH_RE.test(url)) {
						return url;
					}
					return util.replacePattern(url, regExp);
				};
				matcher = resolveVar(rule, vals, req);
				files = getFiles(matcher);
				matcher = setProtocol(matcher, curUrl);
				result = extend(
					{
						url: matcher,
						files:
							files &&
							files.map(function (file) {
								return replaceSubMatcher(file);
							})
					},
					rule
				);
				result.matcher = matcher;
				removeFilters(result);
				if (isIndex) {
					return result;
				}
				results.push(result);
			}
		} else if (rule.wildcard) {
			var wildcard = rule.wildcard;
			var hostname = null; // 不能去掉
			if (wildcard.preMatch.test(curUrl)) {
				hostname = RegExp.$1;
			}
			if (hostname != null && checkFilter()) {
				filePath = curUrl.substring(hostname.length);
				var wPath = wildcard.path;
				if (wildcard.isExact) {
					if (
						(filePath === wPath ||
							filePath.replace(QUERY_RE, '') === wPath) &&
						--index < 0
					) {
						if (
							(result = getExactRule(
								getRelativePath(wPath, filePath, rule.matcher)
							))
						) {
							return result;
						}
					}
				} else if (filePath.indexOf(wPath) === 0) {
					var wpLen = wPath.length;
					filePath = filePath.substring(wpLen);
					if (
						(wildcard.hasQuery ||
							!filePath ||
							wPath[wpLen - 1] === '/' ||
							SEP_RE.test(filePath)) &&
						--index < 0
					) {
						origMatcher = resolveVar(rule, vals, req);
						matcher = setProtocol(origMatcher, curUrl);
						files = getFiles(matcher);
						if (wildcard.hasQuery && filePath) {
							filePath = '?' + filePath;
						}
						if ((result = getPathRule())) {
							return result;
						}
					}
				}
			}
		} else if (rule.isExact) {
			matchedRes = pattern === url || pattern === curUrl;
			if (
				(not ? !matchedRes : matchedRes) &&
				checkFilter() &&
				--index < 0
			) {
				if (
					(result = getExactRule(
						getRelativePath(pattern, curUrl, rule.matcher)
					))
				) {
					return result;
				}
			}
		} else if (
			((matchedUrl = curUrl.indexOf(pattern) === 0) ||
				(rule.isDomain && domainUrl.indexOf(pattern) === 0)) &&
			checkFilter()
		) {
			var len = pattern.length;
			origMatcher = resolveVar(rule, vals, req);
			matcher = setProtocol(origMatcher, curUrl);
			files = getFiles(matcher);
			var hasQuery = pattern.indexOf('?') !== -1;
			if (
				(hasQuery ||
					(matchedUrl
						? pattern == url || isPathSeparator(url[len])
						: pattern == _domainUrl ||
						  isPathSeparator(_domainUrl[len])) ||
					isPathSeparator(pattern[len - 1])) &&
				--index < 0
			) {
				filePath = (matchedUrl ? curUrl : domainUrl).substring(len);
				if (hasQuery && filePath) {
					filePath = '?' + filePath;
				}
				if ((result = getPathRule())) {
					return result;
				}
			}
		}
	}

	return isIndex ? null : results;
}
function removeFilters(rule) {
	var filters = rule.filters;
	if (filters) {
		if (filters.curFilter) {
			rule.filter = filters.curFilter;
		}
		delete rule.filters;
	}
}
function resolveValue(rule, vals, req) {
	if (!rule) {
		return;
	}

	var matcher = rule.matcher;
	var index = matcher.indexOf('://') + 3;
	var protocol = matcher.substring(0, index);
	matcher = matcher.substring(index);
	var key = getKey(matcher);
	if (key) {
		rule.key = key;
	}
	var value = getValueFor(key, vals);
	if (value == null) {
		value = false;
	}
	if (value !== false || (value = getValue(matcher)) !== false) {
		rule.value = protocol + value;
		if (rule.isTpl) {
			rule.value = resolveTplVar(rule.value, req);
		}
	} else if ((value = getPath(matcher)) !== false) {
		rule.path = protocol + value;
		rule.files = getFiles(rule.path);
	}
	return rule;
}
function setProtocol(target, source) {
	if (util.hasProtocol(target)) {
		return target;
	}

	var protocol = util.getProtocol(source);
	if (protocol == null) {
		return target;
	}

	return protocol + (NO_SCHEMA_RE.test(target) ? '' : '//') + target;
}
function Rules(values) {
	this._rules = protoMgr.getRules();
	this._values = values || {};
}

const proto = Rules.prototype;

proto.parse = function (rawRules) {
	parseText(this, rawRules);
	//console.log(this._rules.host);
	//console.log(this._rules.rule);
};

proto.resolveReqRules = function (req) {
	return resolveRules.call(this, req, true);
};
module.exports = Rules;
