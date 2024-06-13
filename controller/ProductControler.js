const ProductSchema = require('../model/ProductModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

//add product function

const AddProduct = async (req, res) => {
  try {
    const { productId, category } = req.body;
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
    res.status(200).json({ products: response });
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
    const { id } = req.params.id;
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
    const { id } = req.params.id;
    const { productId, category } = req.body;
    const existingProduct = await ProductSchema.findOne({ _id: id });

    if (existingProduct) {
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

      // Check if there are changes in product details
      const isProductIdChanged = existingProduct.productId !== productId;
      const isCategoryChanged = existingProduct.category !== category;

      // Check if there are changes in files
      const existingFiles = existingProduct.files || [];
      const areFilesChanged =
        JSON.stringify(existingFiles) !== JSON.stringify(files);

      // Identify files to delete
      const newFilePaths = files.map((file) => file.path);
      const filesToDelete = existingFiles
        .filter((file) => !newFilePaths.includes(file.path))
        .map((file) => file.path);

      if (isProductIdChanged || isCategoryChanged || areFilesChanged) {
        // Delete old files that are not included in the new files list
        filesToDelete.forEach((filePath) => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });

        // Update product details
        existingProduct.productId = productId;
        existingProduct.category = category;
        existingProduct.files = files;
        const updatedProduct = await existingProduct.save();

        res.status(200).json(updatedProduct);
      } else {
        res
          .status(200)
          .json({ message: 'No changes detected, nothing updated.' });
      }
    } else {
      res
        .status(404)
        .json({ error: 'Product not found.', message: 'Product not found.' });
    }
  } catch (error) {
    // Delete uploaded files in case of an error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(file.destination, file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(400).json({ error, message: error.message });
  }
};
module.exports = {
  AddProduct,
  GetAllProduct,
  DeleteProduct,
  EditProduct,
  DisplayOneProduct,
};
