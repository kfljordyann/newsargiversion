/**
 * Middleware d'erreur centralisé. Les messages renvoyés au client
 * restent compréhensibles pour un utilisateur non technique ; les
 * détails techniques ne sont journalisés que côté serveur.
 */
function notFoundHandler(req, res) {
  res.status(404).json({ message: "Ressource introuvable." });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.status || 500;
  const message =
    status === 500
      ? "Une erreur interne est survenue. Veuillez réessayer plus tard."
      : err.message;
  res.status(status).json({ message });
}

module.exports = { notFoundHandler, errorHandler };
