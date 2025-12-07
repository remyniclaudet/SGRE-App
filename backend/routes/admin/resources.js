// backend/routes/admin/resources.js - NOUVELLE
const express = require('express');
const router = express.Router();
const resourceController = require('../../controllers/admin/resourceController');
const authMiddleware = require('../../middleware/auth');

// Toutes les routes nécessitent ADMIN
router.use(authMiddleware.requireAuth, authMiddleware.requireAdmin);

// Gestion des ressources
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.post('/', resourceController.createResource);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;