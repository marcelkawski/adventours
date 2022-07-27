const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        required: [true, 'Please confirm your password'],
        validate: {
            // Works only on create and save.
            validator: function (el) {
                return el === this.password;
            },
            message: 'The passwords do not match :(',
        },
    },
});

// encryption (hashing) middleware - between the moment that we receive data and moment when it's persisted to database.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // We delete this field because we need it only for validation. It's required in the schema but required only for input, not to be persisted to db.
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
