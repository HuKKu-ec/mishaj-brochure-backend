const express = require('express');
const router = express.Router();
const upload = require('../helpers/multerHelpers');
const requireAuth = require('../middleware/Authorization');

const {
  AddProduct,
  GetAllProduct,
  DeleteProduct,
  DisplayOneProduct,
  EditProduct,
} = require('../controller/ProductControler');
const bodyParser = require('body-parser');
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(requireAuth);

router.post('/', upload.array('files'), AddProduct);
router.get('/', GetAllProduct);
router.delete('/', DeleteProduct);
router.get('/:id', DisplayOneProduct);
router.update('/:id', EditProduct);
module.exports = router;
