// dbInsert.js

const mongoose = require('mongoose');

const Product = require('./../Models/product')

// Create model
const Product = mongoose.model('Product', productSchema);

// Product data 
let products = [
  {
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Connect to MongoDB and insert
mongoose.connect('mongodb://localhost:27017/productsdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Insert products
    await Product.insertMany(products);
    console.log('Products inserted successfully');

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });
