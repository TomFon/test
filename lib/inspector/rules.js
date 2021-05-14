const parseUrl = require('../util/parse-url');
const {rules} = require('../rules')

module.exports = function (req, res, next) {
    const options = req.options = parseUrl(req.url)
    console.log(req.options)
    for (let key in rules) {
        const item = rules[key]
        if (item && item.length) {
            item.some((val)=>{
                const pattern = val.protocol ? val.pattern : `http://${val.pattern}` 
                const urlObj = parseUrl(pattern)
                if (urlObj.hostname === options.hostname) {
                   req.rule = val
                }
            })
        }
    }
	next();
};
    