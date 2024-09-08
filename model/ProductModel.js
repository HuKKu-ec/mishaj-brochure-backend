const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductSchema = new Schema(
  {
    productId: { type: String, unique: true, required: true },
    category: { type: String, required: true },
    files: [Object],
    available_size_and_rate: { type: Array },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Product', ProductSchema);
