const ProductSchema = require('../model/ProductModel');
const CategorySchema = require('../model/CategoryModel');
const GetAllProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.cate || 'All';
  const searchQuery = req.query.searchQuery || '';

  // Construct the query object
  let query = {};
  if (category !== 'All') {
    query.category = category;
  }

  if (searchQuery) {
    // Use a regular expression to perform a case-insensitive search
    query.$or = [
      {
        productId: { $regex: searchQuery, $options: 'i' },
      },
    ];
  }

  try {
    // Get total count of matching documents
    const totalProducts = await ProductSchema.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get products with pagination
    const products = await ProductSchema.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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
