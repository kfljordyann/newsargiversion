const { query } = require('../config/db');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    categorie: row.categorie,
    icone: row.icone,
    description: row.description,
    ordre: row.ordre,
    actif: row.actif,
    prestations: row.prestations,
  };
}

async function findAll({ onlyActive = true } = {}) {
  const sql = onlyActive
    ? 'SELECT * FROM services WHERE actif = true ORDER BY ordre ASC'
    : 'SELECT * FROM services ORDER BY ordre ASC';
  const { rows } = await query(sql);
  return rows.map(mapRow);
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM services WHERE id = $1', [id]);
  return mapRow(rows[0]);
}

async function findPrestation(serviceId, prestationId) {
  const service = await findById(serviceId);
  if (!service) return null;
  return service.prestations.find((p) => p.id === prestationId) || null;
}

/**
 * Mise à jour partielle et configurable : nom, catégorie, description,
 * icône, disponibilité, ordre d'affichage — sans toucher au code, comme
 * demandé dans le cahier des charges initial.
 */
async function update(id, changes) {
  const current = await findById(id);
  if (!current) return null;

  const merged = { ...current, ...changes };
  const { rows } = await query(
    `UPDATE services SET categorie = $1, icone = $2, description = $3, ordre = $4, actif = $5, prestations = $6
     WHERE id = $7
     RETURNING *`,
    [
      merged.categorie,
      merged.icone,
      merged.description,
      merged.ordre,
      merged.actif,
      JSON.stringify(merged.prestations),
      id,
    ]
  );
  return mapRow(rows[0]);
}

module.exports = { findAll, findById, findPrestation, update };
