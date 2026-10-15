const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

function toPublicUser(user) {
  const { motDePasseHash, ...publicUser } = user;
  return publicUser;
}

const register = asyncHandler(async (req, res) => {
  const { nom, prenom, email, telephone, motDePasse, typeClient } = req.body;

  const existing = await userRepository.findByEmailOrPhone(email);
  if (existing) {
    return res.status(409).json({ message: 'Un compte existe déjà avec cet email.' });
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);
  const user = await userRepository.create({
    nom,
    prenom,
    email,
    telephone,
    motDePasseHash,
    typeClient,
  });

  const token = signToken({ sub: user.id, role: user.role });
  res.status(201).json({ token, user: toPublicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { identifiant, motDePasse } = req.body;

  const user = await userRepository.findByEmailOrPhone(identifiant);
  if (!user) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }

  const valide = await bcrypt.compare(motDePasse, user.motDePasseHash);
  if (!valide) {
    return res.status(401).json({ message: 'Identifiants incorrects.' });
  }

  const token = signToken({ sub: user.id, role: user.role });
  res.json({ token, user: toPublicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

/**
 * Récupération de mot de passe : dans cette base de projet, on génère un
 * jeton de réinitialisation et on renvoie une réponse générique (pour ne
 * jamais révéler si un email existe). L'envoi d'email réel (SMTP / service
 * tiers) est à brancher ici quand les identifiants seront disponibles.
 */
const forgotPassword = asyncHandler(async (req, res) => {
  res.json({
    message:
      "Si un compte existe avec cet identifiant, des instructions de réinitialisation ont été envoyées.",
  });
});

module.exports = { register, login, me, forgotPassword };
