const serviceRepository = require('../repositories/serviceRepository');
const asyncHandler = require('../utils/asyncHandler');

const listServices = asyncHandler(async (req, res) => {
  res.json({ services: await serviceRepository.findAll() });
});

const getService = asyncHandler(async (req, res) => {
  const service = await serviceRepository.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service introuvable.' });
  }
  res.json({ service });
});

/**
 * Réservé à l'administration (rôle admin) : permet de modifier un service
 * sans toucher au code (nom, description, icône, disponibilité, ordre...).
 */
const updateService = asyncHandler(async (req, res) => {
  const service = await serviceRepository.update(req.params.id, req.body);
  if (!service) {
    return res.status(404).json({ message: 'Service introuvable.' });
  }
  res.json({ service });
});

module.exports = { listServices, getService, updateService };
