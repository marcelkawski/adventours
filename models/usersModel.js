const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'An user must have a name.'],
    },

    email: {
        type: String,
        required: [true, 'An user must have an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please type a valid email.'],
    },

    photo: String,

    password: {
        type: String,
        required: [true, 'An user must have a password.'],
        minlength: 8,
    },

    passwordConfirm: {
        type: String,
        required: [true, 'The passwords should match.'],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
