const Review = require('./../models/reviewsModel');
const factory = require('./handlerFactory');

exports.setTourUsersIds = (req, res, next) => {
    // for creating reviews and getting user id either from URL or from currently logged-in user
    if (!req.body.tour) req.body.tour = req.params.tourId; // from URL
    if (!req.body.user) req.body.author = req.user.id; // from logged-in user
    next();
};

exports.getReviewById = factory.getOneById(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReviewById = factory.updateOneById(Review);
exports.deleteReviewById = factory.deleteOneById(Review);
