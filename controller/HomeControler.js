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

module.exports = { GetAllProduct, GetAllCategorys };
