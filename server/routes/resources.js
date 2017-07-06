var app = require('express');
var router = app.Router();
var loginController = require('../controllers/login.js');

router.route('/login')
  .get(loginController.text);

module.exports = router;
