/**
 * Routes de gestion des ressources
 */

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);

// Routes protégées
router.use(authMiddleware.requireAuth);

// Création/modification suppression (Manager/Admin seulement)
router.post('/', authMiddleware.requireManagerOrAdmin, resourceController.createResource);
router.put('/:id', authMiddleware.requireManagerOrAdmin, resourceController.updateResource);
router.delete('/:id', authMiddleware.requireManagerOrAdmin, resourceController.deleteResource);

// Vérification de disponibilité
router.get('/:id/availability', resourceController.checkAvailability);

module.exports = router;