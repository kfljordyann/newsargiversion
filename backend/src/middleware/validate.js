const { validationResult } = require('express-validator');

/**
 * À placer après une chaîne de règles express-validator dans une route.
 * Renvoie une 422 avec des messages clairs si la validation échoue.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Certains champs sont invalides.',
      erreurs: errors.array().map((e) => ({ champ: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = validate;
