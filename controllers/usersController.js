const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (object, ...allowedFields) => {
    const filteredObj = {};
    Object.keys(object).forEach(key => {
        if (allowedFields.includes(key)) filteredObj[key] = object[key];
    });

    // another solution
    // const filteredObj = Object.keys(object)
    //     .filter(key => allowedFields.includes(key))
    //     .reduce((obj, key) => {
    //         obj[key] = object[key];
    //         return obj;
    //     }, {});

    return filteredObj;
};

// route handlers

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

exports.updateAccount = catchAsync(async (req, res, next) => {
    // updating owb account data
    // 1. Create error if user POSTs password data.
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for updating a password. Please use "/updatePassword" instead.',
                400 // bad request
            )
        );
    }

    // 2. Filter out unwanted fields names that are not allowed to be updated.
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3. Update user document.
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

exports.getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

exports.updateUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

exports.deleteUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};
