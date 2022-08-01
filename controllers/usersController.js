const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync');

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
