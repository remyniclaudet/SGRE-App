/**
 * Routes d'authentification
 * POST /api/v1/auth/register - Inscription
 * POST /api/v1/auth/login - Connexion
 * GET /api/v1/auth/me - Information utilisateur courant
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Information utilisateur courant
router.get('/me', authMiddleware.requireAuth, authController.getCurrentUser);

module.exports = router;