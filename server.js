const express = require('express');
const app = express();

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const AdminRouter = require('./Routers/AdminRouter');
const CategoryRouter = require('./Routers/CategoryRouter');
const ProductRouter = require('./Routers/ProductRouter');
const HomeRouter = require('./Routers/HomeRouter');
app.use(express.json());

//admin router is connected to server
// Video POST handler.

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/home', HomeRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/category', CategoryRouter);
app.use('/api/products', ProductRouter);
app.listen(process.env.PORT, () => {
  console.log('express app is working at port:', process.env.PORT);
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('mongoose is connected'))
    .catch((err) => {
      console.log(err);
    });
});
