const parseUrl = require('../util/parse-url');
const {rules} = require('../rules')

module.exports = function (req, res, next) {
    req.options = parseUrl(req.url)
   // const {protocol,host,hostname  } = req.options
    for (let key in rules) {
        const item = rules[key]
        if (item && item.length) {
            item.some((val)=>{
               
            })
        }
    }
	next();
};
    