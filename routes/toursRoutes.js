const express = require('express');

const toursController = require('./../controllers/toursController');

const router = express.Router();

// router.param('id', toursController.checkID);

router
    .route('/')
    .get(toursController.getAllTours)
    // .post(toursController.checkCrTourBody, toursController.createTour);
    .post(toursController.createTour);

router
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTourById)
    .delete(toursController.deleteTourById);

module.exports = router;
