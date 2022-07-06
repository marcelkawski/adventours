const express = require('express');

const toursController = require('./../controllers/toursController');

const router = express.Router();

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
