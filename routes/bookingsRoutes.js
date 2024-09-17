const express = require('express');

const bookingsController = require('./../controllers/bookingsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// checkout
router.get('/checkout-session/:tourId', bookingsController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

// CRUD operations
router
    .route('/')
    .get(bookingsController.getAllBookings)
    .post(bookingsController.createBooking);

router
    .route('/:id')
    .get(bookingsController.getBookingById)
    .patch(bookingsController.updateBookingById)
    .delete(bookingsController.deleteBookingById);

module.exports = router;
