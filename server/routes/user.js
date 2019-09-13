const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const UserModel = require('./../models/user');
const { verifyToken, verifyAdminRole } = require('./../middlewares/authentication');

// Retrieve an existing register
app.get('/user', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    let query = { status: true };

    from = Number.parseInt(from);
    limit = Number.parseInt(limit);

    UserModel.find(query, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err 
                });
            }

            UserModel.count(query, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                });
            });
        });
});

// Add new register
app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;

    let user = new UserModel({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        status: body.status,
        google: body.google
    });

    user.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err 
            });
        }

        res.json({
            ok: true,
            user: userDb
        });
    });
});

// Update an existing register
app.put('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    const userUpdate = {
        name: body.name,
        email: body.email,
        img: body.img,
        role: body.role,
        status: body.status === 'true'
    };
    console.log(userUpdate);

    UserModel.findByIdAndUpdate(id, userUpdate, { new: true, runValidators: true }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err 
            });
        }

        res.json({
            ok: true,
            user: userDb
        });
    });
});

// Delete an existing register
app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    // UserModel.findByIdAndRemove(id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err 
    //         });
    //     }

    //     if (userDeleted === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'User not found'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDeleted
    //     });
    // });

    let newStatus = false;

    UserModel.findByIdAndUpdate(id, { status: newStatus }, { new: true }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err 
            });
        }

        res.json({
            ok: true,
            user: userDb
        });
    });
});

module.exports = app;