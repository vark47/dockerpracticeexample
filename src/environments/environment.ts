// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

var customConfig = require('../../env.json');

var myDefault = {"production": false, "api":{}}

// var myDefault = {
//   production: false,
//   proxy: "http://192.168.1.1:808",
//   CLIENT_PORT: "3000",
//   AUTH_SERVER_URL: "http://192.168.1.17:8585"
// };

export const environment = Object.assign({}, myDefault, customConfig.dev)


