const express = require('express');
const chatController = require('../controlers/chatController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Czat
 *   description: Endpointy do zarządzania czatami użytkownika i listą znajomych
 */

/**
 * @swagger
 * /getChats:
 *   post:
 *     summary: Pobierz czaty użytkownika
 *     tags: [Czat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista czatów użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chatId:
 *                     type: string
 *                     description: ID czatu
 *                   avatar:
 *                     type: string
 *                     description: Avatar czatu
 *                   name:
 *                     type: string
 *                     description: Nazwa czatu (lub lista użytkowników w czacie grupowym)
 *                   isAnyUserOnline:
 *                     type: boolean
 *                     description: Informacja, czy któryś z użytkowników jest online
 *                   lastUsersActivityDatesArray:
 *                     type: string
 *                     format: date-time
 *                     description: Data ostatniej aktywności użytkowników w czacie
 *       500:
 *         description: Wystąpił błąd podczas pobierania czatów użytkownika
 */
router.post('/getChats', chatController.findUserChat);

/**
 * @swagger
 * /getFriends:
 *   get:
 *     summary: Pobierz listę znajomych użytkownika
 *     tags: [Znajomi]
 *     responses:
 *       200:
 *         description: Lista znajomych użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   friendshipId:
 *                     type: string
 *                     description: Unikalne ID znajomości
 *                   userId:
 *                     type: string
 *                     description: ID użytkownika, który nawiązał znajomość
 *                   friendUserData:
 *                     type: object
 *                     description: Dane użytkownika będącego znajomym
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: Unikalne ID znajomego
 *                       name:
 *                         type: string
 *                         description: Imię znajomego
 *                       email:
 *                         type: string
 *                         description: Email znajomego
 *                       password:
 *                         type: string
 *                         description: Hasło znajomego
 *                       avatar:
 *                         type: string
 *                         format: url
 *                         description: URL do avatara znajomego
 *                       isOnline:
 *                         type: boolean
 *                         description: Status online znajomego
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Data utworzenia konta znajomego
 *                   friendId:
 *                     type: string
 *                     description: ID znajomego
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Data utworzenia znajomości
 *       401:
 *         description: Brak autoryzacji użytkownika
 */

router.post('/getFriends', chatController.getFriendsOfGivenUser);

router.post('/toggleChatVisibility', chatController.toggleUserInChatVisibility);
router.post('/getProfile', chatController.getProfileData);

router.post('/getAllUsersFromChat', chatController.getAllUsersFromChat);
router.post('/toggleUserInChatVisibilityState', chatController.toggleUserInChatHiddenState);
router.post('/createChat', chatController.createChat);

module.exports = router;