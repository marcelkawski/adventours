const express = require('express');

const toursController = require('./../controllers/toursController');
const authController = require('./../controllers/authController');
const reviewsRouter = require('./../routes/reviewsRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter); // Use reviewsRouter when you get route like this.

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

module.exports = router;
