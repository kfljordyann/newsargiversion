const fs = require('fs');
const path = require('path');
const store = require('./jsonStore');

const COLLECTION = 'services';
const SEED_FILE = path.join(__dirname, '..', 'seed', 'services.json');

/**
 * Le catalogue de services est initialisé une seule fois à partir du
 * fichier de seed (contenu réel fourni par SARGI). Une fois copié dans
 * data/services.json, il devient modifiable par l'administration sans
 * jamais toucher au code — c'est ce qui rend les services "configurables"
 * comme demandé (nom, catégorie, description, icône, ordre, disponibilité).
 */
function ensureSeeded() {
  const existing = store.readAll(COLLECTION);
  if (existing.length === 0) {
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
    store.writeAll(COLLECTION, seed);
    return seed;
  }
  return existing;
}

function findAll({ onlyActive = true } = {}) {
  const services = ensureSeeded();
  const filtered = onlyActive ? services.filter((s) => s.actif) : services;
  return [...filtered].sort((a, b) => a.ordre - b.ordre);
}

function findById(id) {
  return ensureSeeded().find((s) => s.id === id) || null;
}

function findPrestation(serviceId, prestationId) {
  const service = findById(serviceId);
  if (!service) return null;
  return service.prestations.find((p) => p.id === prestationId) || null;
}

function update(id, changes) {
  const services = ensureSeeded();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  services[index] = { ...services[index], ...changes, id };
  store.writeAll(COLLECTION, services);
  return services[index];
}

module.exports = { findAll, findById, findPrestation, update };
