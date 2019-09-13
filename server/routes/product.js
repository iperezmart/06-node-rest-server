const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
let app = express();
let ProductModel = require('../models/product');

app.get('/product', (req, res) => {
    ProductModel.find({})
        // .sort('description')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productListDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err 
                });
            }

            res.json({
                ok: true,
                products: productListDb
            });
        });
});

app.get('/product/:id', (req, res) => {
    let id = req.params.id;
    
    ProductModel.findById(id, (err, productDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if (!productDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDb
        });
    });
});

app.get('/product/search/:name', verifyToken, (req, res) => {
    let name = req.params.name;
    let regex = new RegExp(name, 'i');

    ProductModel.find({ name: regex })
        //.populate('category', 'description')
        .exec((err, productsDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err 
                });
            }

            res.json({
                ok: true,
                products: productsDb
            });
        });
});

app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new ProductModel({
        name: body.description,
        description: body.description,
        price: body.price,
        available: body.available,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        res.json({
            ok: true,
            product: productDb
        });
    });
});

app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let product = {
        name: body.description,
        description: body.description,
        price: body.price,
        available: body.available,
        category: body.category,
    };

    ProductModel.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, productDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if (!productDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDb
        });
    });
});

app.delete('/product/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    ProductModel.findById(id, (err, productDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if (!productDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        productDb.available = false;

        productDb.save((err, productUnavailableDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err 
                });
            }

            res.json({
                ok: true,
                product: productUnavailableDb
            });
        });
    });
});

module.exports = app;
