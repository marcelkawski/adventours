const express = require('express');

const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.use(authController.isLoggedIn); // Before we had this enabled for all the routes. But we query the user in both protect and isLoggedIn middleware functions what is not ideal. So now we put isLoggedIn only to the routes in which we did not use protect.

router.get('/', authController.isLoggedIn, viewsController.getOverview); // all tours page
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
