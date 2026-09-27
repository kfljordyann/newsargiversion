const express = require('express');
const { body } = require('express-validator');
const requestController = require('../controllers/requestController');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('serviceId').notEmpty().withMessage('Le service est requis.'),
    body('description').trim().notEmpty().withMessage('Merci de décrire votre besoin.'),
  ],
  validate,
  requestController.createRequest
);

router.get('/mes-demandes', requireAuth, requestController.listMyRequests);
router.get('/:id', requireAuth, requestController.getRequest);

router.get('/', requireAuth, requireRole('admin'), requestController.listAllRequests);
router.patch(
  '/:id/statut',
  requireAuth,
  requireRole('admin'),
  [body('statut').notEmpty().withMessage('Le statut est requis.')],
  validate,
  requestController.updateRequestStatus
);

module.exports = router;
