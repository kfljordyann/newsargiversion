/**
 * Pilote de persistance basé sur des fichiers JSON.
 *
 * IMPORTANT : ce module est le SEUL endroit qui touche au système de
 * fichiers. Les repositories (userRepository, serviceRepository, ...)
 * exposent une API métier (findAll, findById, create, update, remove)
 * qui ne change pas si demain ce fichier est remplacé par un vrai
 * driver PostgreSQL / MySQL / MongoDB. Le reste de l'application
 * (controllers, routes) ne dépend jamais directement de ce module.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function ensureFile(collection) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const file = filePath(collection);
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]', 'utf-8');
  return file;
}

function readAll(collection) {
  const file = ensureFile(collection);
  const raw = fs.readFileSync(file, 'utf-8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeAll(collection, records) {
  const file = ensureFile(collection);
  fs.writeFileSync(file, JSON.stringify(records, null, 2), 'utf-8');
}

module.exports = { readAll, writeAll };
