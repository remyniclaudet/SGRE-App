/**
 * Routes de gestion des réservations
 */

const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware.requireAuth);

// Récupérer les réservations
router.get('/', reservationController.getAllReservations);
router.get('/user/:userId', reservationController.getUserReservations);
router.get('/:id', reservationController.getReservationById);

// Créer une réservation
router.post('/', reservationController.createReservation);

// Mettre à jour une réservation (seulement propriétaire ou manager/admin)
router.put('/:id', reservationController.updateReservation);

// Gestion du statut (Manager/Admin seulement)
router.patch('/:id/status', authMiddleware.requireManagerOrAdmin, reservationController.changeReservationStatus);

// Annuler une réservation
router.delete('/:id', reservationController.cancelReservation);

module.exports = router;