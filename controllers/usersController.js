const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

// exports.updateCurrentUser = (req, res, next) => {
//     // 1. Create error if user POSTs password data.
//     if (req.body.password || req.body.passwordConfirm) {
//         return next(
//             new AppError(
//                 'This route is not for updating a password. Please use "/updatePassword" instead.',
//                 400 // bad request
//             )
//         );
//     }

//     // 2. Update user document.
//     res.status(200).json({
//         status: 'success',
//     });
// };

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
