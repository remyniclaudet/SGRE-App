/**
 * Routes de gestion des utilisateurs
 * Accessible uniquement par les administrateurs
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tous les endpoints nécessitent une authentification
router.use(authMiddleware.requireAuth);

// Récupérer tous les utilisateurs (admin seulement)
router.get('/', authMiddleware.requireAdmin, userController.getAllUsers);

// Récupérer un utilisateur par ID
router.get('/:id', authMiddleware.requireAdmin, userController.getUserById);

// Mettre à jour un utilisateur
router.put('/:id', authMiddleware.requireAdmin, userController.updateUser);

// Changer le rôle d'un utilisateur
router.patch('/:id/role', authMiddleware.requireAdmin, userController.changeUserRole);

// Désactiver/Activer un utilisateur
router.patch('/:id/status', authMiddleware.requireAdmin, userController.toggleUserStatus);

module.exports = router;