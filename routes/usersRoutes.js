const express = require('express');

const usersController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');

const router = express.Router();

// not logged-in users
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protect all routes after this middleware
router.use(authController.protect);

// for currently logged-in user
router.get('/me', usersController.getMe, usersController.getUserById);
router.patch('/updatePassword', authController.updatePassword);
// for updating user using API
router.patch(
    '/updateMe',
    usersController.uploadUserPhoto,
    usersController.resizeUserPhoto,
    usersController.updateMe
);
router.delete('/deleteMe', usersController.deleteMe);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser);

router
    .route('/:id')
    .get(usersController.getUserById)
    .patch(usersController.updateUserById)
    .delete(usersController.deleteUserById);

module.exports = router;
