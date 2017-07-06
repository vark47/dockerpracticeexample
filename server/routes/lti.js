var app = require('express');
var router = app.Router();

router.post('/os', function (req, res) {
  var datJson = {
    data: req.body,
    endUrl: "LoginLTI",
    moduleName: "Login"
  }
  postCall(function (str, header) {
    loadIndex(req, res, str, header, "occsort");
  }, datJson);
});

router.post('/eq', function (req, res) {
  var datJson = {
    data: req.body,
    endUrl: "LoginLTI",
    moduleName: "Login"
  }
  postCall(function (str, header) {
    loadIndex(req, res, str, header, "entrepreneurquiz");
  }, datJson);
});

router.post('/ip', function (req, res) {
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
module.exports = router;

var postCall = function (cb, userdata) {

  try {
    console.log("postcall userdata-->" + JSON.stringify(userdata) + "=====envVar-->" + JSON.stringify(envVar));
    //Below statement is to encode url.
    var data1 = { "stateAbbr": "IC" };

    var str = Object.keys(data1).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data1[key]);
    }).join('&');
    var urltest = process.env.AUTH_SERVER_URL + "/ltiPost";
    var req = request.post({
      url: urltest,
      body: JSON.stringify(userdata),
      proxy: process.env.proxy,
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