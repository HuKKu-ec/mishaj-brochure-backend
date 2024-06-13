const jwt = require('jsonwebtoken');
const AdminSchema = require('../model/AdminModel');

//creating a json web token
const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: '30000d' });
  return token;
};

///admin login function-->There is only option to login we need contact administractor to create a admin

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminSchema.login(email, password);
    const token = createToken(admin._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  AdminLogin,
};
