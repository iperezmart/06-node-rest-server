const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user');

app.post('/login', (req, res) => {
    let body = req.body;

    UserModel.findOne({ email: body.email }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err 
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(User) or password invalid'
                }
            });
        }
        
        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or (password) invalid'
                }
            });
        }

        let token = jwt.sign({
            user: userDb
        }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRATION });

        res.json({
            ok: true,
            user: userDb,
            token: token
        });
    });
});

module.exports = app;
