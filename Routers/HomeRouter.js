const express = require('express');
const router = express.Router();
const {
  GetAllProduct,
  GetAllCategorys,
  DisplayOneProduct,
} = require('../controller/HomeControler');
router.get('/', GetAllProduct);
router.get('/category', GetAllCategorys);
router.get('/:id', DisplayOneProduct);

module.exports = router;
