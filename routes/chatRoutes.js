const express = require('express');
const chatController = require('../controlers/chatController');

const router = express.Router();

router.post('/getChats', chatController.findUserChat);
router.post('/getFriends', chatController.getFriendsOfGivenUser);

module.exports = router;
