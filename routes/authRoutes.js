const express = require('express');
const authController = require('../controlers/authController');

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

router.post('/user', authController.getUserById);

module.exports = router;
