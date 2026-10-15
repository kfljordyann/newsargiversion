const { query } = require('../config/db');

const STATUTS = [
  'Nouvelle demande',
  'En cours',
  "En attente d'informations",
  'Traitée',
  'Clôturée',
];

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    serviceId: row.service_id,
    prestationId: row.prestation_id,
    description: row.description,
    urgence: row.urgence,
    informationsComplementaires: row.informations_complementaires,
    piecesJointes: row.pieces_jointes,
    statut: row.statut,
    dateCreation: row.date_creation,
    dateMiseAJour: row.date_mise_a_jour,
  };
}

async function findAll() {
  const { rows } = await query('SELECT * FROM requests ORDER BY date_creation DESC');
  return rows.map(mapRow);
}

async function findByUser(userId) {
  const { rows } = await query(
    'SELECT * FROM requests WHERE user_id = $1 ORDER BY date_creation DESC',
    [userId]
  );
  return rows.map(mapRow);
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM requests WHERE id = $1', [id]);
  return mapRow(rows[0]);
}

async function create({ userId, serviceId, prestationId, description, urgence, informationsComplementaires, piecesJointes }) {
  const { rows } = await query(
    `INSERT INTO requests (user_id, service_id, prestation_id, description, urgence, informations_complementaires, pieces_jointes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      userId,
      serviceId,
      prestationId || null,
      description,
      urgence || 'normale',
      informationsComplementaires || '',
      JSON.stringify(piecesJointes || []),
    ]
  );
  return mapRow(rows[0]);
}

async function updateStatus(id, statut) {
  if (!STATUTS.includes(statut)) return null;
  const { rows } = await query(
    `UPDATE requests SET statut = $1, date_mise_a_jour = now() WHERE id = $2 RETURNING *`,
    [statut, id]
  );
  return mapRow(rows[0]);
}

module.exports = { STATUTS, findAll, findByUser, findById, create, updateStatus };
