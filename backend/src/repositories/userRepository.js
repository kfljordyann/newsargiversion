const { query } = require('../config/db');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    telephone: row.telephone,
    motDePasseHash: row.mot_de_passe_hash,
    typeClient: row.type_client,
    role: row.role,
    dateCreation: row.date_creation,
  };
}

async function findAll() {
  const { rows } = await query('SELECT * FROM users ORDER BY date_creation DESC');
  return rows.map(mapRow);
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return mapRow(rows[0]);
}

async function findByEmailOrPhone(identifier) {
  const value = (identifier || '').trim().toLowerCase();
  const { rows } = await query(
    'SELECT * FROM users WHERE lower(email) = $1 OR telephone = $2 LIMIT 1',
    [value, identifier]
  );
  return mapRow(rows[0]);
}

async function create(userData) {
  const { rows } = await query(
    `INSERT INTO users (nom, prenom, email, telephone, mot_de_passe_hash, type_client, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      userData.nom,
      userData.prenom,
      userData.email,
      userData.telephone,
      userData.motDePasseHash,
      userData.typeClient || 'particulier',
      userData.role || 'client',
    ]
  );
  return mapRow(rows[0]);
}

async function update(id, changes) {
  const current = await findById(id);
  if (!current) return null;

  const merged = { ...current, ...changes };
  const { rows } = await query(
    `UPDATE users SET nom = $1, prenom = $2, telephone = $3, type_client = $4
     WHERE id = $5
     RETURNING *`,
    [merged.nom, merged.prenom, merged.telephone, merged.typeClient, id]
  );
  return mapRow(rows[0]);
}

module.exports = { findAll, findById, findByEmailOrPhone, create, update };
