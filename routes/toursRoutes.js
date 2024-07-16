const express = require('express');

const toursController = require('./../controllers/toursController');
const authController = require('./../controllers/authController');
const reviewsRouter = require('./../routes/reviewsRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter); // Use reviewsRouter when you get route like this.

router
    .route('/')
    .get(toursController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        toursController.createTour
    );

router
    .route('/:id')
    .get(toursController.getTourById)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        toursController.uploadTourImages,
        toursController.resizeTourImages,
        toursController.updateTourById
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        toursController.deleteTourById
    );

router
    .route('/top-5-cheapest')
    .get(toursController.aliasTop5Cheapest, toursController.getAllTours);

router.route('/stats').get(toursController.getStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        toursController.getMonthlyPlan
    );

// now: /tours-within/distance/233/center/36.206511,-115.026708/unit/mi (CLEANER)
// another way: /tours-within?distance=233&center=36.206511,-115.026708&unit=mi
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(toursController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(toursController.getDistances);

module.exports = router;
