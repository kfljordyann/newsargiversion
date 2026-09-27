/**
 * Enveloppe un contrôleur async pour transmettre automatiquement les
 * erreurs à errorHandler.js via next(err), sans dupliquer de try/catch
 * partout.
 */
module.exports = function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
