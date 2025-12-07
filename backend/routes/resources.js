const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticate, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/public', resourceController.getPublicResources);
router.get('/public/:id', resourceController.getPublicResourceById);

// Routes authentifiées
router.get('/', authenticate, resourceController.getAllResources);
router.get('/available', authenticate, resourceController.getAvailableResources);
router.get('/stats', authenticate, resourceController.getResourceStats);

// Routes manager/admin
router.post('/', authenticate, authorize('manager', 'admin'), resourceController.createResource);
router.get('/:id', authenticate, resourceController.getResourceById);
router.put('/:id', authenticate, authorize('manager', 'admin'), resourceController.updateResource);
router.delete('/:id', authenticate, authorize('manager', 'admin'), resourceController.deleteResource);

module.exports = router;