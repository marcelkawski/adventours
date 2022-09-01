const express = require('express');

const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true }); // mergeParams to get access to tourId from tours router (from toursRoutes.js)

router.use(authController.protect);

router.route('/').get(reviewsController.getAllReviews).post(
    authController.restrictTo('user'),
    reviewsController.setTourUsersIds, // for creating reviews (runs before it)
    reviewsController.createReview
);

router
    .route('/:id')
    .patch(reviewsController.updateReviewById)
    .delete(reviewsController.deleteReviewById);

module.exports = router;
