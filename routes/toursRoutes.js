const express = require('express');

const toursController = require('./../controllers/toursController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/top-5-cheapest')
    .get(toursController.aliasTop5Cheapest, toursController.getAllTours);

router.route('/stats').get(toursController.getStats);
router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, toursController.getAllTours)
    .post(toursController.createTour);

router
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTourById)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        toursController.deleteTourById
    );

module.exports = router;
