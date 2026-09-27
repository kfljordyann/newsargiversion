# SARGI BENIN — Plateforme Web

Base de projet complète (frontend + backend + API) pour le site officiel de
**SARGI BENIN**, cabinet multidisciplinaire (juridique, financier, immobilier,
informatique, intelligence artificielle) fondé en 2022 au Bénin.

Ce dépôt contient une application réellement exploitable, pas une simple
maquette : authentification, catalogue de services configurable, demandes et
souscriptions, formulaire de contact avec saisie vocale, espace client, et
une architecture prête pour évoluer vers une vraie base de données et une
application mobile.

---

## 1. Structure du projet

```
sargi-benin/
├── backend/                 API REST (Node.js + Express)
│   └── src/
│       ├── config/
│       ├── controllers/     Logique métier par ressource
│       ├── data/            Fichiers JSON générés au runtime (dev uniquement)
│       ├── middleware/      Auth, validation, gestion d'erreurs
│       ├── repositories/    Accès aux données (couche à remplacer par une vraie BDD)
│       ├── routes/
│       ├── seed/            Données de démarrage (catalogue de services, admin de test)
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── frontend/                Application React + Vite
│   └── src/
│       ├── api/             Appels HTTP vers le backend
│       ├── components/      Composants réutilisables (Navbar, Footer, cartes...)
│       ├── config/          Configuration centralisée (logo, contact, couleurs)
│       ├── contexts/        Authentification, notifications (toasts)
│       ├── hooks/           useVoiceInput (saisie vocale)
│       ├── layouts/         Layout public / layout espace client
│       └── pages/           Pages du site + pages de l'espace client
│
├── .gitignore
├── .env.example
└── README.md
```

Cette séparation frontend/backend (API REST indépendante) est volontaire :
elle permet de brancher plus tard une application mobile (React Native /
Expo) ou de transformer le frontend en PWA installable sans réécrire le
backend.

---

## 2. Prérequis

- Node.js 18 ou supérieur (`node --version`)
- npm (livré avec Node.js)

## 3. Installation

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # crée le catalogue de services + un compte admin de test
npm run dev
```

L'API démarre sur `http://localhost:4000`. Vérification rapide :
`http://localhost:4000/api/health` doit répondre `{"status":"ok"}`.

Identifiants admin créés par `npm run seed` (à changer immédiatement) :
- Email : `admin@sargi-benin.com`
- Mot de passe : `ChangeMoi123!`

### Frontend

Dans un second terminal :

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Le site est accessible sur `http://localhost:5173`.

---

## 4. Persistance des données

Par défaut (`DB_DRIVER=json` dans `backend/.env`), les données sont stockées
dans de simples fichiers JSON sous `backend/src/data/` — pratique pour
démarrer et tester rapidement, sans installer de base de données.

**Ce choix n'est pas figé.** Toute la logique métier (contrôleurs) passe
exclusivement par la couche `backend/src/repositories/`. Pour migrer vers
PostgreSQL, MySQL ou MongoDB :

1. Créez un nouveau fichier dans `repositories/` qui expose exactement les
   mêmes fonctions (`findAll`, `findById`, `create`, `update`...) mais qui
   interroge la vraie base de données au lieu de `jsonStore.js`.
2. Remplacez l'import correspondant dans les contrôleurs.

Aucune route, aucun contrôleur, aucun composant frontend n'a besoin d'être
modifié.

---

## 5. Fonctionnalités incluses

- **Vitrine** : accueil, à propos, catalogue de services par catégories
  (juridique, financier, assurances, immobilier, informatique, intelligence
  artificielle, services complémentaires) avec le contenu réel fourni par
  SARGI.
- **Comptes utilisateurs** : inscription (particulier / entreprise /
  professionnel / investisseur), connexion, récupération de mot de passe,
  mots de passe hashés (bcrypt), sessions par JWT.
- **Espace client** : vue d'ensemble, mes demandes (avec statuts), nouvelle
  demande/souscription, messages, profil.
- **Contact intelligent** : formulaire de contact avec **saisie vocale**
  (API Web Speech du navigateur), dégradation propre si le navigateur ne
  supporte pas la reconnaissance vocale, correction manuelle toujours
  possible avant l'envoi.
- **Sécurité** : validation frontend + backend, hashage des mots de passe,
  JWT, CORS configuré, limitation de requêtes, en-têtes sécurisés (helmet),
  variables sensibles dans `.env` (jamais commité).
- **Rôles & permissions** : `client` / `admin` (base pour un futur tableau
  de bord administrateur — routes déjà protégées par rôle côté API).
- **PWA-ready** : `manifest.json`, icônes, meta tags, structure compatible
  avec une future stratégie de cache (service worker à ajouter).
- **États d'interface** : chargement (skeletons), vide, succès, erreur,
  page 404, accès non autorisé.

## 6. Ce qui est volontairement préparé mais non activé

Conformément au cahier des charges (ne pas construire des fonctionnalités
non nécessaires à la V1), l'architecture est prête à accueillir, sans
refonte majeure :

- Chat en temps réel, notifications push, WhatsApp, chatbot, assistant vocal
  (voir section "Contact client" du cahier des charges).
- Tableau de bord administrateur complet (les routes API par rôle `admin`
  existent déjà : `GET /api/utilisateurs`, `GET /api/demandes`,
  `PATCH /api/demandes/:id/statut`, `PUT /api/services/:id`).
- Migration vers React Native / Expo (le frontend ne contient aucune
  logique métier — tout passe par l'API REST).

## 7. Informations manquantes

Certaines informations n'étaient pas présentes dans les documents fournis
(coordonnées de contact précises, réseaux sociaux, tarifs...). Elles
apparaissent comme `[À CONFIGURER]` dans `frontend/src/config/siteConfig.js`
— un seul fichier à modifier une fois ces informations disponibles.

## 8. Déploiement

- **Backend** : déployable séparément (Render, Railway, ou tout hébergeur
  Node.js). Pensez à définir `JWT_SECRET`, `CLIENT_URL` et `DB_DRIVER` dans
  les variables d'environnement du service choisi.
- **Frontend** : déployable sur Vercel, Netlify ou tout hébergeur statique
  après `npm run build` (dossier `frontend/dist/`). Définissez
  `VITE_API_URL` avec l'URL publique du backend.
- **GitHub** : voir la procédure fournie séparément (`procedure-github-sargi.pdf`)
  pour la mise en ligne du dépôt et les tests post-clonage.

## 9. Prochaines étapes suggérées

1. Remplacer `DB_DRIVER=json` par une vraie base de données avant la mise
   en production.
2. Compléter `siteConfig.js` avec les informations officielles de contact.
3. Construire le tableau de bord administrateur (les routes API existent déjà).
4. Ajouter un service worker pour le mode hors-ligne (PWA installable).
