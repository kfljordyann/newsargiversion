const express = require('express');
const serviceController = require('../controllers/serviceController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', serviceController.listServices);
router.get('/:id', serviceController.getService);
router.put('/:id', requireAuth, requireRole('admin'), serviceController.updateService);

module.exports = router;
