const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
let app = express();
let CategoryModel = require('../models/category');

app.get('/category', (req, res) => {
    CategoryModel.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categoryListDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err 
                });
            }

            res.json({
                ok: true,
                categories: categoryListDb
            });
        });
});

app.get('/category/:id', (req, res) => {
    let id = req.params.id;
    
    CategoryModel.findById(id, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let category = new CategoryModel({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let category = {
        description: body.description
    };

    CategoryModel.findByIdAndUpdate(id, category, { new: true, runValidators: true }, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    CategoryModel.findByIdAndRemove(id, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err 
            });
        }

        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

module.exports = app;
