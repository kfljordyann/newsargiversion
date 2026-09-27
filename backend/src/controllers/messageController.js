const messageRepository = require('../repositories/messageRepository');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Formulaire de contact public : accessible sans compte. Le champ
 * "message" peut avoir été rempli via la saisie vocale côté frontend —
 * il arrive ici comme du texte normal, l'API ne sait pas d'où il vient.
 */
const sendContactMessage = asyncHandler(async (req, res) => {
  const { nom, email, telephone, serviceId, message } = req.body;
  const record = messageRepository.createFromContactForm({ nom, email, telephone, serviceId, message });
  res.status(201).json({
    message: 'Votre message a bien été envoyé. Notre équipe vous recontactera rapidement.',
    contact: record,
  });
});

const sendClientMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const record = messageRepository.createFromClient({ userId: req.user.id, message });
  res.status(201).json({ contact: record });
});

const listMyMessages = asyncHandler(async (req, res) => {
  res.json({ messages: messageRepository.findByUser(req.user.id) });
});

const listAllMessages = asyncHandler(async (req, res) => {
  res.json({ messages: messageRepository.findAll() });
});

module.exports = { sendContactMessage, sendClientMessage, listMyMessages, listAllMessages };
