var os = require('os');
var siteDefaults = require('../data/siteDefaults');
module.exports = function (req, res, next) {

    var hostname = process.env.site_override ? process.env.site_override : os.hostname();
    req.locals = Object.assign({}, req.locals, { site: siteDefaults.getDefaults(hostname) });
    
    next();

}