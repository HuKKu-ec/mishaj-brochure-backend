const express = require('express');
const router = express.Router();
const {
  GetAllProduct,
  GetAllCategorys,
} = require('../controller/HomeControler');
router.get('/', GetAllProduct);
router.get('/category', GetAllCategorys);

module.exports = router;
