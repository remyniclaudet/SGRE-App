// backend/routes/manager/resources.js - NOUVELLE
const express = require('express');
const router = express.Router();
const resourceController = require('../../controllers/manager/resourceController');
const authMiddleware = require('../../middleware/auth');

// Toutes les routes nécessitent MANAGER
router.use(authMiddleware.requireAuth, authMiddleware.requireManager);

// Gestion des ressources (Manager)
router.get('/', resourceController.getManagerResources);
router.get('/:id', resourceController.getResourceById);
router.post('/', resourceController.createResource);
router.put('/:id', resourceController.updateResource);
router.patch('/:id/status', resourceController.updateResourceStatus);

module.exports = router;