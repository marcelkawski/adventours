const express = require('express');

const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(reviewsController.getAllReviews)
    .post(authController.restrictTo('user'), reviewsController.createReview);

module.exports = router;
