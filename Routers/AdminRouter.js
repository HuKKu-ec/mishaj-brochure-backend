const express = require('express');
const router = express.Router();
const { AdminLogin } = require('../controller/AdminControler');
const bodyParser = require('body-parser');
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//admin router end points
router.post('/', AdminLogin);

module.exports = router;
