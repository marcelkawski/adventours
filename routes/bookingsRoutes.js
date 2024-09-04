const express = require('express');

const bookingsController = require('./../controllers/bookingsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(
    '/checkout-session/:tourId',
    authController.protect,
    bookingsController.getCheckoutSession
);

module.exports = router;
