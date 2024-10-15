const express = require('express');

const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingsController = require('./../controllers/bookingsController');

const router = express.Router();

// to display alert after successful payment on deployed production app but can be reused for another alert
// router.use(viewsController.alerts);

// router.use(authController.isLoggedIn); // Before we had this enabled for all the routes. But we query the user in both protect and isLoggedIn middleware functions what is not ideal. So now we put isLoggedIn only to the routes in which we did not use protect.

router.get(
    '/',
    bookingsController.createBookingAfterCheckout,
    authController.isLoggedIn,
    viewsController.getOverview
); // all tours page
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

// for updating user without using API - just using HTML form
router.post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;
