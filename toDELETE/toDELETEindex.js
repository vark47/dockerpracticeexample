var express = require('express');
var app = express();
var path = require('path');
var args = process.argv.slice(2);
var envVar = require('./clientConfig').getFile(args);
var compression = require('compression');
var request = require('request');
var bodyParser = require('body-parser');

var __projectRoot = './dist';
app.disable('x-powered-by');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(compression({ threshold: 0 }));



app.use(express.static(__projectRoot));
var renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
}

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);

  if (req.method == "OPTIONS") {
    res.send("OPTIONS SUCCESS");
  } else {
    next();
  }
});
app.get('/*', renderIndex);
app.post('/lti/os', function (req, res) {
  var datJson = {
    data: req.body,
    endUrl: "LoginLTI",
    moduleName: "Login"
  }
  postCall(function (str, header) {
    loadIndex(req, res, str, header, "occsort");
  }, datJson);
});

app.post('/lti/eq', function (req, res) {
  var datJson = {
    data: req.body,
    endUrl: "LoginLTI",
    moduleName: "Login"
  }
  postCall(function (str, header) {
    loadIndex(req, res, str, header, "entrepreneurquiz");
  }, datJson);
});

app.post('/lti/ip', function (req, res) {
  var datJson = {
    data: req.body,
    endUrl: "LoginLTI",
    moduleName: "Login"
  }

  postCall(function (str, header) { loadIndex(req, res, str, header, "interestprofilersf"); }, datJson);
});

var loadIndex = function (req, res, str, header, module) {

  console.log("loadIndex called result is:" + str);
  if (str != "") {

    var servResp = JSON.parse(str);
    var sessionId = servResp.sessionID;
    var acctId = servResp.Result.AccountID;
    var LogoutURL = servResp.Result.LogoutURL;



    try {

      res.cookie("LTILogin2", JSON.stringify({ "acctId": acctId, "module": module, "auth_key": sessionId, "Logouturl": LogoutURL }));


    } catch (e) {
      console.log("exception:" + e.message);
    }
    renderIndex(req, res);
  }
}


var postCall = function (cb, userdata) {

  try {
    console.log("postcall userdata-->" + JSON.stringify(userdata) + "=====envVar-->" + JSON.stringify(envVar));
    //Below statement is to encode url.
    var data1 = { "stateAbbr": "IC" };

    var str = Object.keys(data1).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data1[key]);
    }).join('&');
    var urltest = envVar.AUTH_SERVER_URL + "/ltiPost";
    var req = request.post({
      url: urltest,
      body: JSON.stringify(userdata),
      proxy: envVar.proxy,
      headers: {
        'Authorization': envVar.Authorization,
        'content-type': 'application/json'
      }
    }, function (err, res, body) {
      try {
        cb(body, (body).StatusCode);
      } catch (e) {
        console.log(" exception occured while get call:" + JSON.stringify(e));
        cb(JSON.stringify(e), 403);
      }
    });
  } catch (error) {
    console.log(" getCall exception:" + error.message);
    cb(JSON.stringify(error), 500);
  }

}
var server = app.listen(envVar.CLIENT_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("PLP app listening at http://%s:%s", host, port);
})
