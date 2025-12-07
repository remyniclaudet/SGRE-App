/**
 * Routes de gestion des notifications
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware.requireAuth);

// Récupérer les notifications de l'utilisateur
router.get('/', notificationController.getUserNotifications);

// Marquer une notification comme lue
router.patch('/:id/read', notificationController.markAsRead);

// Marquer toutes les notifications comme lues
router.patch('/read-all', notificationController.markAllAsRead);

// Supprimer une notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;