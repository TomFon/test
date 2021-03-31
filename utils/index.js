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

exports.isRegExp = function isRegExp(regExp) {
	return REG_EXP_RE.test(regExp);
};

function hasProtocol(url) {
	return /^[a-z0-9.-]+:\/\//i.test(url);
}

exports.hasProtocol = hasProtocol;
