const protocols = ['host', 'rule'];
const pureResProtocols = [];
const aliasProtocols = {
	hosts: 'host'
};
const reqProtocols = protocols.filter(function (name) {
	return pureResProtocols.indexOf(name) === -1;
});
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
exports.pureResProtocols = pureResProtocols;
exports.reqProtocols = reqProtocols;
