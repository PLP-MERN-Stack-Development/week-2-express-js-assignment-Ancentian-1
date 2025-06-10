const Product = require('./../Models/product')
const validateProduct = require('../middleware/validateProduct');

const express = require('express')
const app = express();

const router = express.Router();

//All Products
router.get('/products', async(req, res, next) => { 
    try {
        const products = await Product.find()
        res.status(201).send(products)
    } catch {
        res.status(400)
        next(error)
    }
})

//Add Product
router.post('/products', validateProduct, async(req, res, next)=>{
    try {
        const product = new Product(req.body)
        await product.save()
        res.status(201).send(product)
    } catch (error) {
        res.status(400)
        next(error)
    }
})

//Single Product
router.get('/products/:id', async(req, res, next)=>{
    const _id = req.params._id
    try {
        const product = await Product.findById(_id)
        if(!product){
            return res.status(404).send();
        }
        res.status(200).send(product)
    } catch (error) {
        res.status(404)
        next(error)
    }
})

//Update Product
router.put('/products/:id', validateProduct, async(req, res, next) =>{
    const _id = req.params.id
    try {
        const product = await Product.findByIdAndUpdate(_id, req.body, {
            new : true,
            runValidators: true
        })
        if(!product){
            return res.status(404).send();
        }
        res.status(200).send(product)
    } catch (error) {
        res.status(400)
        next(error)
    }
})

//Search by Category
router.get('/products/:category', async(req, res, next) => {
    const category = req.params.category
    try {
        const products = await Product.find({category: category})
        if(!products){
            res.status(404).send(error)
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(404)
        next(error)
    }
})

//Delete Product
router.delete('/products/:id', async (req, res, next) => {
    const _id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(_id);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        console.log(product);
        res.status(200).send(product);
    } catch (error) {
        res.status(400)
        next(error)
    }
});

//List products with optional category filter and pagination
router.get('/products', async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET /products/search - Search products by name 
router.get('/products/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Query parameter "name" is required' });
        }

        const regex = new RegExp(name, 'i'); // case-insensitive
        const results = await Product.find({ name: regex });

        res.json({ total: results.length, data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get count of products by category
router.get('/products/stats', async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router