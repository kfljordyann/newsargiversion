const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/inscription',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis.'),
    body('prenom').trim().notEmpty().withMessage('Le prénom est requis.'),
    body('email').isEmail().withMessage('Email invalide.'),
    body('telephone').trim().notEmpty().withMessage('Le téléphone est requis.'),
    body('motDePasse').isLength({ min: 8 }).withMessage('8 caractères minimum.'),
    body('confirmationMotDePasse').custom((value, { req }) => {
      if (value !== req.body.motDePasse) {
        throw new Error('La confirmation ne correspond pas au mot de passe.');
      }
      return true;
    }),
    body('typeClient')
      .isIn(['particulier', 'entreprise', 'professionnel', 'investisseur'])
      .withMessage('Type de client invalide.'),
  ],
  validate,
  authController.register
);

router.post(
  '/connexion',
  [
    body('identifiant').trim().notEmpty().withMessage('Email ou téléphone requis.'),
    body('motDePasse').notEmpty().withMessage('Mot de passe requis.'),
  ],
  validate,
  authController.login
);

router.post(
  '/mot-de-passe-oublie',
  [body('identifiant').trim().notEmpty().withMessage('Email ou téléphone requis.')],
  validate,
  authController.forgotPassword
);

router.get('/moi', requireAuth, authController.me);

module.exports = router;
