const { query } = require('../config/db');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    nom: row.nom,
    email: row.email,
    telephone: row.telephone,
    serviceId: row.service_id,
    message: row.message,
    lu: row.lu,
    dateEnvoi: row.date_envoi,
  };
}

async function findAll() {
  const { rows } = await query('SELECT * FROM messages ORDER BY date_envoi ASC');
  return rows.map(mapRow);
}

async function findByUser(userId) {
  const { rows } = await query(
    'SELECT * FROM messages WHERE user_id = $1 ORDER BY date_envoi ASC',
    [userId]
  );
  return rows.map(mapRow);
}

/**
 * Messages envoyés par un visiteur non connecté depuis le formulaire de
 * contact (pas de compte requis pour contacter SARGI).
 */
async function createFromContactForm({ nom, email, telephone, serviceId, message }) {
  const { rows } = await query(
    `INSERT INTO messages (user_id, nom, email, telephone, service_id, message)
     VALUES (NULL, $1, $2, $3, $4, $5)
     RETURNING *`,
    [nom, email, telephone || '', serviceId || null, message]
  );
  return mapRow(rows[0]);
}

async function createFromClient({ userId, message }) {
  const { rows } = await query(
    `INSERT INTO messages (user_id, message) VALUES ($1, $2) RETURNING *`,
    [userId, message]
  );
  return mapRow(rows[0]);
}

module.exports = { findAll, findByUser, createFromContactForm, createFromClient };
