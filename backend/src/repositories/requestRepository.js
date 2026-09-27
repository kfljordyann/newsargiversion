const { v4: uuid } = require('uuid');
const store = require('./jsonStore');

const COLLECTION = 'requests';

const STATUTS = [
  'Nouvelle demande',
  'En cours',
  "En attente d'informations",
  'Traitée',
  'Clôturée',
];

function findAll() {
  return store.readAll(COLLECTION);
}

function findByUser(userId) {
  return findAll()
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
}

function findById(id) {
  return findAll().find((r) => r.id === id) || null;
}

function create({ userId, serviceId, prestationId, description, urgence, informationsComplementaires, piecesJointes }) {
  const requests = findAll();
  const request = {
    id: uuid(),
    userId,
    serviceId,
    prestationId: prestationId || null,
    description,
    urgence: urgence || 'normale', // faible | normale | haute
    informationsComplementaires: informationsComplementaires || '',
    piecesJointes: piecesJointes || [],
    statut: STATUTS[0],
    dateCreation: new Date().toISOString(),
    dateMiseAJour: new Date().toISOString(),
  };
  requests.push(request);
  store.writeAll(COLLECTION, requests);
  return request;
}

function updateStatus(id, statut) {
  if (!STATUTS.includes(statut)) return null;
  const requests = findAll();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;
  requests[index].statut = statut;
  requests[index].dateMiseAJour = new Date().toISOString();
  store.writeAll(COLLECTION, requests);
  return requests[index];
}

module.exports = { STATUTS, findAll, findByUser, findById, create, updateStatus };
