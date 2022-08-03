const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // built-in

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

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },

    password: {
        type: String,
        required: [true, 'An user must have a password.'],
        minlength: 8,
        select: false, // to never show up in any output
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

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetTokenExpires: Date,
});

// encryption (hashing) middleware - between the moment that we receive data and moment when it's persisted to database.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // We delete this field because we need it only for validation. It's required in the schema but required only for input, not to be persisted to db.
    next();
});

userSchema.methods.correctPassword = async function (
    givenPassword,
    userPassword
) {
    // this.password; not available since we have select: false in password field
    return await bcrypt.compare(givenPassword, userPassword);
};

userSchema.methods.changedPwdAfterToken = function (JWTTimestamp) {
    // checking if user changed password after getting token
    if (this.passwordChangedAt) {
        const pwdChangedAtTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < pwdChangedAtTimestamp;
    }

    // not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
