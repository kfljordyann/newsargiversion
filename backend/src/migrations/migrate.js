/**
 * Applique les fichiers .sql de ce dossier, dans l'ordre alphabétique,
 * en gardant la trace de ce qui a déjà été exécuté (table
 * schema_migrations). Rejouer ce script ne réapplique jamais une
 * migration déjà passée — sûr à relancer à chaque déploiement.
 *
 * Usage : npm run migrate
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function getAppliedMigrations() {
  const { rows } = await pool.query('SELECT filename FROM schema_migrations');
  return new Set(rows.map((r) => r.filename));
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL manquant. Renseignez-le dans backend/.env avant de migrer.');
    process.exit(1);
  }

  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`↷ déjà appliquée : ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`✓ appliquée : ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`✗ échec sur ${file} :`, err.message);
      process.exit(1);
    } finally {
      client.release();
    }
  }

  console.log('Migrations terminées.');
  await pool.end();
}

run();
