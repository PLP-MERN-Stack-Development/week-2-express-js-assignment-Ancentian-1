const Product = require('./../Models/product')

const express = require('express')
const app = express();

const router = express.Router();

//All Products
router.get('/products', async(req, res) => {
    try {
        const products = await Product.find()
        res.status(201).send(products)
    } catch {
        res.status(400).send(error)
    }
})

//Add Product
router.post('/products', async(req, res)=>{
    try {
        const product = new Product(req.body)
        await product.save()
        res.status(201).send(product)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Single Product
router.get('/products/:id', async(req, res)=>{
    const _id = req.params._id
    try {
        const product = await Product.findById(_id)
        if(!product){
            return res.status(404).send();
        }
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Update Product
router.put('/products/:id', async(req, res) =>{
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
        res.status(400).send(error)
    }
})

//Delete Product
router.get('/products/:id', async(req, res) =>{
    const _id = re.params.id
    try {
        const product = await Product.findByIdAndDelete(_id)
        if(!product){
            return res.status(400).send(error)
        }
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router