require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use(require('./routes/index'));

// Staring server
const port = process.env.PORT;

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) {
        throw new err;
    }

    console.log('DB connected!');
});

app.listen(port, () => {
    console.log('Listen on port: ', port);
});
