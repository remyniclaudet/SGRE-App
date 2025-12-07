const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', configController.getConfig);
router.put('/', authenticate, authorize('admin'), configController.updateConfig);

module.exports = router;