const express = require('express');

const usersController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
    '/updatePassword',
    authController.protect,
    authController.updatePassword
);
router.patch(
    '/updateAccount',
    authController.protect,
    usersController.updateAccount
);

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
