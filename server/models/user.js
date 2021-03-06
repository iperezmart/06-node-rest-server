const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let validRoles = {
    values: ['ADMI_ROLE', 'USER_ROLE'],
    message: 'Role {VALUE} is not valid'
};

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        required: true
    },
    google: {
        type: String,
        required: false
    }
});

// Esto nos permite no devolver el campo 'password' al transformar el campo a JSON
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model('User', userSchema);
