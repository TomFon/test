const protocols = ['host', 'rule'];

const aliasProtocols = {
	hosts: 'host'
};

function resetRules(rules) {
	protocols.forEach(function (protocol) {
		rules[protocol] = [];
	});
	return rules;
}
function getRules() {
	return resetRules({});
}

exports.getRules = getRules;
exports.protocols = protocols;
exports.aliasProtocols = aliasProtocols;
