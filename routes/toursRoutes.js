const express = require('express');

const toursController = require('./../controllers/toursController');

const router = express.Router();

router
    .route('/top-5-cheapest')
    .get(toursController.aliasTop5Cheapest, toursController.getAllTours);

router.route('/stats').get(toursController.getStats);
router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
    .route('/')
    .get(toursController.getAllTours)
    .post(toursController.createTour);

router
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTourById)
    .delete(toursController.deleteTourById);

module.exports = router;
