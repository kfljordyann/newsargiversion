/**
 * Script optionnel : npm run seed
 * Initialise le catalogue de services (table PostgreSQL `services`) à partir
 * de services.json et crée un compte administrateur par défaut pour pouvoir
 * tester l'espace admin.
 *
 * IMPORTANT : changez ce mot de passe immédiatement après la première
 * connexion, ou définissez SEED_ADMIN_PASSWORD dans .env avant de lancer
 * le script en production.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const servicesData = require('./services.json');
const userRepository = require('../repositories/userRepository');

async function seedServices() {
  for (const service of servicesData) {
    await query(
      `INSERT INTO services (id, categorie, icone, description, ordre, actif, prestations)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         categorie = EXCLUDED.categorie,
         icone = EXCLUDED.icone,
         description = EXCLUDED.description,
         ordre = EXCLUDED.ordre,
         actif = EXCLUDED.actif,
         prestations = EXCLUDED.prestations`,
      [
        service.id,
        service.categorie,
        service.icone,
        service.description,
        service.ordre,
        service.actif,
        JSON.stringify(service.prestations),
      ]
    );
  }
  console.log(`Catalogue de services initialisé : ${servicesData.length} catégories.`);
}

async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@sargi-benin.com';
  const existingAdmin = await userRepository.findByEmailOrPhone(adminEmail);

  if (!existingAdmin) {
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMoi123!';
    const motDePasseHash = await bcrypt.hash(password, 10);
    await userRepository.create({
      nom: 'Administrateur',
      prenom: 'SARGI',
      email: adminEmail,
      telephone: '[À CONFIGURER]',
      motDePasseHash,
      typeClient: 'entreprise',
      role: 'admin',
    });
    console.log(`Compte admin créé : ${adminEmail} / ${password} (à changer immédiatement).`);
  } else {
    console.log('Un compte admin existe déjà.');
  }
}

async function run() {
  await seedServices();
  await seedAdmin();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Erreur lors du seed :', err);
    process.exit(1);
  });
