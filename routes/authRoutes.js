const express = require('express');
const authController = require('../controlers/authController');

const router = express.Router();

router.post('/login', authController.loginUser);

router.get('/user/:userId', authController.getUserById);

module.exports = router;
