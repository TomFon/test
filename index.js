const { getRules } = require('./rules/initRules');

getRules().then((res) => {
	console.log(res);
});
