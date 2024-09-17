const Tour = require('./../models/toursModel');
const User = require('./../models/usersModel');
const Booking = require('./../models/bookingsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating author',
    });

    if (!tour) {
        // This code makes this error operational and it's is treated differently but the error handling strategy in errorsController.js
        return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
    // Why no data is sent from here? Because if we are logged in user object is accessible from request (req).
    res.status(200).render('account', {
        title: 'My account',
    });
};

exports.getMyTours = catchAsync(async (req, res) => {
    // We could also get tours using virtual populate.
    // 1. Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2. Find tours with the returned IDs
    const toursIds = bookings.map(booking => booking.tour);
    const tours = await Tour.find({ _id: { $in: toursIds } });
    console.log(tours);

    res.status(200).render('overview', {
        title: 'My tours',
        tours,
    }); // We used the same template as for all the tours because we just display list of tours.
});

// without using API - just using HTML form
exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render('account', {
        title: 'My account',
        user: updatedUser, // Without it it would take user from the previous middleware (ptotect) and we would get the old user, before the update.
    });
});
