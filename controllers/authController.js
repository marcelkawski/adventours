const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
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
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
    });
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
