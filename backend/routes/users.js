const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Routes admin seulement
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.post('/', authenticate, authorize('admin'), userController.createUser);
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);
router.get('/stats', authenticate, authorize('admin'), userController.getUserStats);

module.exports = router;