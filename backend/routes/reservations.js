const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate, authorize } = require('../middleware/auth');

// Routes client
router.get('/my-reservations', authenticate, reservationController.getMyReservations);
router.post('/', authenticate, reservationController.createReservation);
router.put('/:id/cancel', authenticate, reservationController.cancelReservation);

// Routes manager/admin
router.get('/', authenticate, authorize('manager', 'admin'), reservationController.getAllReservations);
router.get('/pending', authenticate, authorize('manager', 'admin'), reservationController.getPendingReservations);
router.put('/:id/status', authenticate, authorize('manager', 'admin'), reservationController.updateReservationStatus);
router.get('/:id', authenticate, reservationController.getReservationById);

module.exports = router;