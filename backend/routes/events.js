/**
 * Routes de gestion des événements
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/:id/participants', eventController.getEventParticipants);

// Routes protégées
router.use(authMiddleware.requireAuth);

// CRUD événements (Manager/Admin)
router.post('/', authMiddleware.requireManagerOrAdmin, eventController.createEvent);
router.put('/:id', authMiddleware.requireManagerOrAdmin, eventController.updateEvent);
router.delete('/:id', authMiddleware.requireManagerOrAdmin, eventController.deleteEvent);

// Gestion participants
router.post('/:id/participants', eventController.addParticipant);
router.delete('/:id/participants/:userId', eventController.removeParticipant);

module.exports = router;