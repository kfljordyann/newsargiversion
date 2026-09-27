const { verifyToken } = require('../utils/jwt');
const userRepository = require('../repositories/userRepository');

/**
 * Vérifie la présence et la validité du token JWT (header Authorization:
 * Bearer <token>). Attache l'utilisateur authentifié à req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  try {
    const decoded = verifyToken(token);
    const user = userRepository.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Session invalide.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expirée ou invalide.' });
  }
}

/**
 * Système de rôles et permissions : plusieurs rôles peuvent être passés,
 * l'accès est refusé si le rôle de l'utilisateur n'y figure pas.
 * Exemple : router.get('/admin', requireAuth, requireRole('admin'), ...)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
