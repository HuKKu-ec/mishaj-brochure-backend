const ProductSchema = require('../model/ProductModel');
const CategorySchema = require('../model/CategoryModel');
const GetAllProduct = async (req, res) => {
  try {
    const response = await ProductSchema.find();
    res.status(200).json({ products: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const GetAllCategorys = async (req, res) => {
  try {
    const response = await CategorySchema.find();
    res.status(200).json({ categorys: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DisplayOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const exist = await ProductSchema.findOne({ _id: id });

    if (exist) {
      res.status(200).json({ product: exist });
    } else {
      res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Failed to display product', message: error.message });
  }
};

module.exports = { GetAllProduct, GetAllCategorys, DisplayOneProduct };
