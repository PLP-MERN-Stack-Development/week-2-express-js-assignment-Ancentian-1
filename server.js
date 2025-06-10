// Import required modules
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const productRoutes = require('./Routes/routes')

const logger = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = 'mongodb://localhost:27017/productsdb';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Middleware
app.use(logger);          
app.use(express.json());  
app.use(authMiddleware);  //Applies to all routes 

//Routes
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to PLP!');
});

app.use('/api', productRoutes);

app.use(errorHandler); // Error handler must be the LAST middleware

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 