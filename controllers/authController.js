const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/sendEmail');

const signToken = id =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // to that sookie cannot be accessed or modifed on any way by browser - only receive, store, send back with every request
    };

    console.log(cookieOptions);

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // to make cookie be sent only on encrypted connection - by https

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check if the email and password exist.
    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400)); // bad request
    }

    // 2. Check if user exists and password is correct.
    const user = await User.findOne({ email }).select('+password'); // to make password be back in output (it has select:false in schema)

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password.', 401)); // unauthorized
    }

    // 3. If everything is OK, send token to client.
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // routes only for logged in users
    // 1. Get token and check if it exists.
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not allowed to view this page. Please log in to get an access.',
                401
            )
        );
    }

    // 2. Verify token.
    const decodedPayload = await promisify(jwt.verify)(
        // error if verification fails
        // Valid token is a token where no one changed a payload. And a payload in our case is always an id of an user for which a token was issued.
        token,
        process.env.JWT_SECRET
    );

    // 3. Check if user still exists.
    const currentUser = await User.findById(decodedPayload.id);
    if (!currentUser)
        return next(
            new AppError(
                'The user belonging to this token does not longer exist.',
                401
            )
        );

    // 4. Check if user changed password after token was issued.
    if (currentUser.changedPwdAfterToken(decodedPayload.iat)) {
        return next(
            new AppError(
                'User changed the password after the token was issued. Please log in again.',
                401
            )
        );
    }

    req.user = currentUser;
    // grant access to protected route
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // req.user is available because of the line "req.user = currentUser;" in exports.protect
            return next(
                new AppError(
                    'You do not have permission to perform this action.',
                    403 // forbidden
                )
            );
        }

        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. Get user based on POSTed email.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('User with that email does not exist.', 404)); // not found
    }

    // 2. Generate random token.
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // option to avoid error because of not updating required fields

    // 3. Send it to user's email.
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password?\nPlease paste this link into your browser to set a new one: ${resetURL}. Your token is valid for 10 minutes.\nIf you did not forget your password, ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset your password',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent by an email 📨',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'An error occurred sending the email. Please try again.',
                500
            )
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1. Get user by token.
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    });

    // 2. If token has not expired and there is user, set new password.
    if (!user) {
        return next(new AppError('Token is invalid or has expired.', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    // 3. Update changedPasswordAt property. - in usersModel in userSchema.pre('save', ...).update
    // 4. Log user in, send JWT.
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // for logged-in users
    // user.findByIdAndUpdate would not work - more in notes.
    // 1. Get user.
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if posted password is correct.
    if (
        !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
        return next(new AppError('Incorrect current password'), 401);
    }

    // 3. If so, update password.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. Log user in, send JWT for with new password.
    createSendToken(user, 200, res);
});
