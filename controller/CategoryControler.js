const CategorySchema = require('../model/CategoryModel');
const ProductSchema = require('../model/ProductModel');

//Add the Category
const AddCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const response = await CategorySchema.create({ category });
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//Get all Categories
const GetCategory = async (req, res) => {
  try {
    const response = await CategorySchema.find();
    res.status(200).json({ categorys: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete Category

const Deletecategory = async (req, res) => {
  try {
    const { category } = req.body;
    const exist = await CategorySchema.findOne({ category });

    if (exist) {
      try {
        const response = await CategorySchema.deleteOne({ category });

        //delete all product with category which is deleted
        const delProduct = await ProductSchema.deleteMany({
          category: { $in: category },
        });

        res.status(200).json({ category: exist });
      } catch (error) {
        res.status(400).json(error.message);
      }
    } else {
      res
        .status(400)
        .json({ error: 'No such category is exist in the category list.' });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  AddCategory,
  GetCategory,
  Deletecategory,
};
