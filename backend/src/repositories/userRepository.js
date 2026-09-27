const { v4: uuid } = require('uuid');
const store = require('./jsonStore');

const COLLECTION = 'users';

function findAll() {
  return store.readAll(COLLECTION);
}

function findById(id) {
  return findAll().find((u) => u.id === id) || null;
}

function findByEmailOrPhone(identifier) {
  const value = (identifier || '').trim().toLowerCase();
  return (
    findAll().find(
      (u) => u.email.toLowerCase() === value || u.telephone === identifier
    ) || null
  );
}

function create(userData) {
  const users = findAll();
  const user = {
    id: uuid(),
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    telephone: userData.telephone,
    motDePasseHash: userData.motDePasseHash,
    typeClient: userData.typeClient || 'particulier', // particulier | entreprise | professionnel | investisseur
    role: userData.role || 'client', // client | admin
    dateCreation: new Date().toISOString(),
  };
  users.push(user);
  store.writeAll(COLLECTION, users);
  return user;
}

function update(id, changes) {
  const users = findAll();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...changes, id };
  store.writeAll(COLLECTION, users);
  return users[index];
}

module.exports = { findAll, findById, findByEmailOrPhone, create, update };
