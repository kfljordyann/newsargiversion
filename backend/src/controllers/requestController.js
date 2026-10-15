const requestRepository = require('../repositories/requestRepository');
const serviceRepository = require('../repositories/serviceRepository');
const asyncHandler = require('../utils/asyncHandler');

const createRequest = asyncHandler(async (req, res) => {
  const { serviceId, prestationId, description, urgence, informationsComplementaires } = req.body;

  const service = await serviceRepository.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: 'Service introuvable.' });
  }

  const request = await requestRepository.create({
    userId: req.user.id,
    serviceId,
    prestationId,
    description,
    urgence,
    informationsComplementaires,
  });

  res.status(201).json({ request });
});

const listMyRequests = asyncHandler(async (req, res) => {
  res.json({ requests: await requestRepository.findByUser(req.user.id) });
});

const getRequest = asyncHandler(async (req, res) => {
  const request = await requestRepository.findById(req.params.id);
  if (!request || (request.userId !== req.user.id && req.user.role !== 'admin')) {
    return res.status(404).json({ message: 'Demande introuvable.' });
  }
  res.json({ request });
});

/**
 * Réservé à l'administration : changement de statut d'une demande
 * (Nouvelle demande, En cours, En attente d'informations, Traitée, Clôturée).
 */
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { statut } = req.body;
  const request = await requestRepository.updateStatus(req.params.id, statut);
  if (!request) {
    return res.status(400).json({ message: 'Statut invalide ou demande introuvable.' });
  }
  res.json({ request });
});

const listAllRequests = asyncHandler(async (req, res) => {
  res.json({ requests: await requestRepository.findAll() });
});

module.exports = {
  createRequest,
  listMyRequests,
  getRequest,
  updateRequestStatus,
  listAllRequests,
};
