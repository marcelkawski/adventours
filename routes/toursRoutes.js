const express = require('express');

const toursController = require('./../controllers/toursController');
const authController = require('./../controllers/authController');
const reviewsController = require('./../controllers/reviewsController');

const router = express.Router();

router
    .route('/top-5-cheapest')
    .get(toursController.aliasTop5Cheapest, toursController.getAllTours);

router.route('/stats').get(toursController.getStats);
router
    .route('/monthly-plan/:year')
    .get(authController.protect, toursController.getMonthlyPlan);

router
    .route('/')
    .get(toursController.getAllTours)
    .post(authController.protect, toursController.createTour);

router
    .route('/:id')
    .get(toursController.getTourById)
    .patch(authController.protect, toursController.updateTourById)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        toursController.deleteTourById
    );

// POST .tour/vjrsft894t6/reviews
// GET .tour/vjrsft894t6/reviews
// GET .tour/vjrsft894t6/reviews/876jhw4gfd

router
    .route('/:tourId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewsController.createReview
    );

router.route('/:id/reviews').get(reviewsController.getAllReviews);

module.exports = router;
