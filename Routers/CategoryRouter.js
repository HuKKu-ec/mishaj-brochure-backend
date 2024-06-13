const express = require('express');
const router = express.Router();
const {
  AddCategory,
  GetCategory,
  Deletecategory,
} = require('../controller/CategoryControler');
const requireAuth = require('../middleware/Authorization');

const bodyParser = require('body-parser');
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(requireAuth);

//admin router end points
router.post('/', AddCategory);

router.get('/', GetCategory);

router.delete('/', Deletecategory);

module.exports = router;
