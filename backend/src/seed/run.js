/**
 * Script optionnel : npm run seed
 * Initialise le catalogue de services et crée un compte administrateur
 * par défaut pour pouvoir tester l'espace admin.
 *
 * IMPORTANT : changez ce mot de passe immédiatement après la première
 * connexion, ou définissez SEED_ADMIN_PASSWORD dans .env avant de lancer
 * le script en production.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const serviceRepository = require('../repositories/serviceRepository');
const userRepository = require('../repositories/userRepository');

async function run() {
  const services = serviceRepository.findAll({ onlyActive: false });
  console.log(`Catalogue de services initialisé : ${services.length} catégories.`);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@sargi-benin.com';
  const existingAdmin = userRepository.findByEmailOrPhone(adminEmail);

  if (!existingAdmin) {
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMoi123!';
    const motDePasseHash = await bcrypt.hash(password, 10);
    userRepository.create({
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

run().then(() => process.exit(0));
