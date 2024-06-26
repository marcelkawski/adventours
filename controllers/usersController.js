const multer = require('multer'); // to upload users' photos

const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb - callback function
        cb(null, 'public/img/users'); // first argument is an error if there is any, the second - actual destination
    },
    filename: (req, file, cb) => {
        // naming convention: "user-<id>-<timestamp>.<extension>" Then we are sure it's unique.
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

// We only want images.
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Not an image. Please upload an image.', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo'); // 'photo' is the name of the field from which the photo will come

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

// for admins
exports.getUserById = factory.getOneById(User);
exports.getAllUsers = factory.getAll(User);
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not implemented. Please use /signup instead.',
    });
};
exports.updateUserById = factory.updateOneById(User); // Don't update password using it!
exports.deleteUserById = factory.deleteOneById(User);

exports.getMe = (req, res, next) => {
    // just setting req.params.id to be used by getOneById in getUserById
    req.params.id = req.user.id;
    next();
};

// for updating user using API
exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req);
    // updating account data
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

    // for saving photos to database
    if (req.file) filteredBody.photo = req.file.filename;

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

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
