/**
 * Routes de rapports
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware.requireAuth);

// Rapports pour admin
router.get('/usage', authMiddleware.requireAdmin, reportController.getResourceUsage);
router.get('/events-stats', authMiddleware.requireAdmin, reportController.getEventStatistics);
router.get('/user-activity', authMiddleware.requireAdmin, reportController.getUserActivity);
router.get('/audit-logs', authMiddleware.requireAdmin, reportController.getAuditLogs);

// Rapports pour manager
router.get('/manager/reservations', authMiddleware.requireManagerOrAdmin, reportController.getManagerReservations);
router.get('/manager/events', authMiddleware.requireManagerOrAdmin, reportController.getManagerEvents);

module.exports = router;