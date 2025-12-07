// backend/routes/admin/users.js - NOUVELLE
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const authMiddleware = require('../../middleware/auth');

// Toutes les routes nécessitent ADMIN
router.use(authMiddleware.requireAuth, authMiddleware.requireAdmin);

// Gestion des utilisateurs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.patch('/:id/role', userController.changeUserRole);
router.patch('/:id/status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;