module.exports = function (req, res, next) {
    if (req.rule) {
        res.send('hello world')
    } else {
        next();
    }
};
    