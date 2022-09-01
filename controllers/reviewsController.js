const Review = require('./../models/reviewsModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId; // from URL
    if (!req.body.user) req.body.author = req.user.id; // logged in user

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

exports.deleteReviewById = factory.deleteOneById(Review);
