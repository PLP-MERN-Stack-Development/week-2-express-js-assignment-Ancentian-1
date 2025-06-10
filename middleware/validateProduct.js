const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name')
  .notEmpty().withMessage('Product name is required')
  .isString().withMessage('Name must be a string')
  .trim()
  .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1-100 characters'),

body('description')
  .notEmpty().withMessage('Product Description is required')
  .isString().withMessage('Description must be a string')
  .trim()
  .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

body('price')
  .notEmpty().withMessage('Price is required')
  .isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),

body('category')
  .notEmpty().withMessage('Category is required')
  .isString().withMessage('Category must be a string')
  .trim(),

body('inStock')
  .optional()
  .isBoolean().withMessage('inStock must be a boolean')
  .toBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        title: "Validation Error",
        message: "Invalid product data",
        errors: errors.array() 
      });
    } else {
      next();
    }
  }
];

module.exports = validateProduct;
