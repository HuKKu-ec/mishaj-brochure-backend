const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AdminSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

AdminSchema.statics.login = async function (email, password) {
  const admin = await this.findOne({ email });
  if (email == '' || password == '') {
    throw Error('The password and email must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not in valid format');
  }
  if (!admin) {
    throw Error(`Email is not Admin's`);
  }
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw Error('Password is incorrect');
  }
  return admin;
};
module.exports = mongoose.model('Admin', AdminSchema);
