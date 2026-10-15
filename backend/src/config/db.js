const { Pool } = require('pg');

/**
 * Pool de connexions PostgreSQL unique pour toute l'application.
 * DATABASE_URL est fourni par Render quand la base est liée au service
 * (voir README pour la procédure). SSL activé car Render l'exige en
 * connexion externe/interne selon le plan.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  // Une connexion idle qui tombe ne doit pas planter tout le process.
  console.error('Erreur inattendue sur le pool PostgreSQL :', err.message);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
