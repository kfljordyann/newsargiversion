const userRepository = require('../repositories/userRepository');
const asyncHandler = require('../utils/asyncHandler');

function toPublicUser(user) {
  const { motDePasseHash, ...publicUser } = user;
  return publicUser;
}

const updateProfile = asyncHandler(async (req, res) => {
  const { nom, prenom, telephone, typeClient } = req.body;
  const user = userRepository.update(req.user.id, { nom, prenom, telephone, typeClient });
  res.json({ user: toPublicUser(user) });
});

/** Réservé à l'administration : liste des comptes clients. */
const listUsers = asyncHandler(async (req, res) => {
  res.json({ users: userRepository.findAll().map(toPublicUser) });
});

module.exports = { updateProfile, listUsers };
