const { v4: uuid } = require('uuid');
const store = require('./jsonStore');

const COLLECTION = 'messages';

function findAll() {
  return store.readAll(COLLECTION);
}

function findByUser(userId) {
  return findAll()
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(a.dateEnvoi) - new Date(b.dateEnvoi));
}

/**
 * Messages envoyés par un visiteur non connecté depuis le formulaire de
 * contact (pas de compte requis pour contacter SARGI).
 */
function createFromContactForm({ nom, email, telephone, serviceId, message }) {
  const messages = findAll();
  const record = {
    id: uuid(),
    userId: null,
    nom,
    email,
    telephone: telephone || '',
    serviceId: serviceId || null,
    message,
    lu: false,
    dateEnvoi: new Date().toISOString(),
  };
  messages.push(record);
  store.writeAll(COLLECTION, messages);
  return record;
}

function createFromClient({ userId, message }) {
  const messages = findAll();
  const record = {
    id: uuid(),
    userId,
    message,
    lu: false,
    dateEnvoi: new Date().toISOString(),
  };
  messages.push(record);
  store.writeAll(COLLECTION, messages);
  return record;
}

module.exports = { findAll, findByUser, createFromContactForm, createFromClient };
