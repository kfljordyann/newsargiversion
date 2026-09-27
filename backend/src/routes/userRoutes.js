const express = require('express');
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.put('/profil', requireAuth, userController.updateProfile);
router.get('/', requireAuth, requireRole('admin'), userController.listUsers);

module.exports = router;
