const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/contact',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('Email invalide.'),
    body('message').trim().notEmpty().withMessage('Le message ne peut pas être vide.'),
  ],
  validate,
  messageController.sendContactMessage
);

router.post(
  '/',
  requireAuth,
  [body('message').trim().notEmpty().withMessage('Le message ne peut pas être vide.')],
  validate,
  messageController.sendClientMessage
);

router.get('/mes-messages', requireAuth, messageController.listMyMessages);
router.get('/', requireAuth, requireRole('admin'), messageController.listAllMessages);

module.exports = router;
