const ProductSchema = require('../model/ProductModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

//add product function

const AddProduct = async (req, res) => {
  try {
    const { productId, category, available_size_and_rate } = req.body;
    const files = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = {
        filename: req.files[i].filename,
        originalname: req.files[i].originalname,
        encoding: req.files[i].encoding,
        mimetype: req.files[i].mimetype,
        destination: req.files[i].destination,
        filename: req.files[i].filename,
        path: req.files[i].path,
        size: req.files[i].size,
      };
      files.push(file);
    }
    const product = await ProductSchema.create({
      productId,
      category,
      files,
      available_size_and_rate: JSON.parse(available_size_and_rate),
    });
    res.status(200).json(product);
  } catch (error) {
    for (let i = 0; i < req.files.length; i++) {
      if (fs.existsSync(`uploads/${req.files[i].filename}`)) {
        fs.unlinkSync(`uploads/${req.files[i].filename}`);
      }
    }
    res.status(400).json({ error, message: error.message });
  }
};
//get all product function
const GetAllProduct = async (req, res) => {
  try {
    const response = await ProductSchema.find();

    res.status(200).json({ products: response.reverse() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete product function
const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const exist = await ProductSchema.findOne({ _id: id });

    if (exist) {
      await ProductSchema.deleteOne({ _id: id });

      for (const file of exist.files) {
        const filePath = path.join(__dirname, '..', 'uploads', file.filename);

        if (fs.existsSync(filePath)) {
          try {
            await fs.promises.unlink(filePath);
            console.log(`File ${filePath} deleted successfully`);
          } catch (fileError) {
            console.error(`Error deleting file ${filePath}:`, fileError);
          }
        } else {
          console.log(`File ${filePath} does not exist`);
        }
      }

      res.status(200).json({ product: exist });
    } else {
      res
        .status(400)
        .json({ error: 'No such Product exists in the Product list.' });
    }
  } catch (error) {
    console.error('Error during product deletion:', error);
    res
      .status(400)
      .json({ error: 'Failed to delete product', message: error.message });
  }
};

// dispaly one product details
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

// dispaly one product update
const EditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, category, currentFilenames, available_size_and_rate } =
      req.body;
    console.log(
      `HERE: ${available_size_and_rate} ${typeof available_size_and_rate}`
    );

    // Initialize parsedSizesAndRates as an empty array
    let parsedSizesAndRates = [];

    if (typeof available_size_and_rate === 'string') {
      // Parse JSON string to object/array
      const parsed = JSON.parse(available_size_and_rate);
      parsedSizesAndRates = Array.isArray(parsed) ? parsed : [parsed];
    } else if (Array.isArray(available_size_and_rate)) {
      // Use array directly
      parsedSizesAndRates = available_size_and_rate.map((item) =>
        JSON.parse(item)
      );
    } else if (typeof available_size_and_rate === 'object') {
      // Wrap single object in an array
      parsedSizesAndRates = available_size_and_rate.map((item) =>
        JSON.parse(item)
      );
    } else {
      throw new Error(
        'available_size_and_rate should be an array, an object, or a valid JSON string.'
      );
    }

    console.log('Parsed Sizes and Rates:', parsedSizesAndRates);

    // Validate productId and category
    if (!productId || !category) {
      return res.status(400).json({
        error: 'productId and category are required fields.',
        message: 'productId and category are required fields.',
      });
    }

    // Initialize files array
    let files = [];
    if (req.files && req.files.length > 0) {
      files = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        path: file.path,
        size: file.size,
      }));
    }

    // Fetch the existing product
    const existingProduct = await ProductSchema.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const existingFiles = await existingProduct.files.filter((file) =>
      currentFilenames.includes(file.filename)
    );
    const filesToDelete = await existingProduct.files.filter(
      (file) => !currentFilenames.includes(file.filename)
    );

    if (existingFiles != false) {
      await files.push(...existingFiles);
    }
    const updateFields = {
      productId,
      category,
      available_size_and_rate: parsedSizesAndRates,
      ...(files.length > 0 && { files }), // Update files only if new files are provided
    };

    const result = await ProductSchema.updateOne(
      { _id: id },
      { $set: updateFields }
    );

    if (result.nModified === 0) {
      return res
        .status(200)
        .json({ message: 'No changes detected, nothing updated.' });
    }

    // Delete old files that are no longer used
    await Promise.all(
      filesToDelete.map(async (file) => {
        if (fs.existsSync(file.path)) {
          await fs.promises.unlink(file.path);
        }
      })
    );

    // Fetch the updated product
    const updatedProduct = await ProductSchema.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    // Delete uploaded files in case of an error
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file) => {
          const filePath = path.join(file.destination, file.filename);
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }
        })
      );
    }

    console.error('Error during product update:', error);
    res
      .status(500)
      .json({ error: 'Failed to update product', message: error.message });
  }
};
module.exports = {
  AddProduct,
  GetAllProduct,
  DeleteProduct,
  EditProduct,
  DisplayOneProduct,
};
