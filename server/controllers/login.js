var data = require('../data/login');

exports.text = function(req, res) {
    
    var myResponse = data.loginText(req.locals.site.site, req.locals.site.lang)
    
    return res.json(myResponse);

}
