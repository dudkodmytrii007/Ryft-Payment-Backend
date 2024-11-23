const express = require('express');
const authController = require('../controlers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autoryzacja
 *   description: Endpointy zarządzające logowaniem, wylogowaniem i sesją użytkownika
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logowanie użytkownika
 *     tags: [Autoryzacja]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email użytkownika
 *               password:
 *                 type: string
 *                 description: Hasło użytkownika
 *     responses:
 *       200:
 *         description: Zalogowano pomyślnie, zwraca dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: Unikalne ID użytkownika
 *                 name:
 *                   type: string
 *                   description: Imię użytkownika
 *                 email:
 *                   type: string
 *                   description: Email użytkownika
 *                 password:
 *                   type: string
 *                   description: Haslo użytkownika
 *                 avatar:
 *                   type: string
 *                   format: url
 *                   description: URL do avatara użytkownika
 *                 isOnline:
 *                   type: boolean
 *                   description: Status użytkownika (czy jest online)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data utworzenia konta
 *       401:
 *         description: Niepoprawne dane logowania (email lub hasło)
 */

router.post('/login', authController.loginUser);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Wyloguj użytkownika
 *     tags: [Autoryzacja]
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
 *         description: Wylogowano pomyślnie
 *       401:
 *         description: Nieprawidłowe zapytanie lub użytkownik nie znaleziony
 */
router.post('/logout', authController.logoutUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Pobierz dane użytkownika
 *     tags: [Użytkownicy]
 *     responses:
 *       200:
 *         description: Dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: Unikalne ID użytkownika
 *                 name:
 *                   type: string
 *                   description: Imię użytkownika
 *                 email:
 *                   type: string
 *                   description: Adres email użytkownika
 *                 password:
 *                   type: string
 *                   description: Hasło użytkownika
 *                 avatar:
 *                   type: string
 *                   format: url
 *                   description: URL do avatara użytkownika
 *                 isOnline:
 *                   type: boolean
 *                   description: Status online użytkownika
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data utworzenia konta użytkownika
 *       401:
 *         description: Brak autoryzacji użytkownika
 */

router.post('/user', authController.getUserById);

module.exports = router;
