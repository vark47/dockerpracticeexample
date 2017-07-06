var args = process.argv.slice(2);
var envVar = require('./clientConfig').getFile(args);
var fs = require('fs')
fs.writeFile('./src/app/app.config.ts', `export var ConfigObj = ` + JSON.stringify(envVar), function (err, data) {
    if (err) {
        return console.log(err);
    }
});