const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/public', eventController.getPublicEvents);

// Routes authentifiées
router.get('/', authenticate, eventController.getAllEvents);
router.get('/my-events', authenticate, authorize('manager'), eventController.getMyEvents);
router.get('/:id', authenticate, eventController.getEventById);

// Routes manager/admin
router.post('/', authenticate, authorize('manager', 'admin'), eventController.createEvent);
router.put('/:id', authenticate, authorize('manager', 'admin'), eventController.updateEvent);
router.delete('/:id', authenticate, authorize('manager', 'admin'), eventController.deleteEvent);
router.post('/:id/resources', authenticate, authorize('manager', 'admin'), eventController.addResourceToEvent);

module.exports = router;