const Review = require('./../models/reviewsModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

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

exports.setTourUsersIds = (req, res, next) => {
    // for creating reviews and getting user id either from URL or from currently logged-in user
    if (!req.body.tour) req.body.tour = req.params.tourId; // from URL
    if (!req.body.user) req.body.author = req.user.id; // from logged-in user
    next();
};

exports.createReview = factory.createOne(Review);
exports.updateReviewById = factory.updateOneById(Review);
exports.deleteReviewById = factory.deleteOneById(Review);
