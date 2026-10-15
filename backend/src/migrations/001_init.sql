-- ============================================================
-- SARGI BENIN + SARGI SOCIAL HUB — Schéma initial PostgreSQL
-- ============================================================
-- Remplace le stockage JSON par une vraie base de données.
-- Conçu pour préserver toutes les fonctionnalités existantes
-- (comptes, services, demandes, messages) et préparer le
-- Social Hub (portfolio, comptes sociaux, publications) sans
-- nouvelle migration majeure plus tard.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Utilisateurs (compte client SARGI + espace admin Social Hub)
-- ------------------------------------------------------------
-- Rôles : on garde 'client' et 'admin' (existants) et on ajoute
-- 'gestionnaire_contenu' et 'lecture_seule' pour le Social Hub,
-- sans casser les comptes déjà créés.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT NOT NULL,
  mot_de_passe_hash TEXT NOT NULL,
  type_client TEXT NOT NULL DEFAULT 'particulier'
    CHECK (type_client IN ('particulier', 'entreprise', 'professionnel', 'investisseur')),
  role TEXT NOT NULL DEFAULT 'client'
    CHECK (role IN ('client', 'admin', 'gestionnaire_contenu', 'lecture_seule')),
  date_creation TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Catalogue de services SARGI (inchangé dans sa forme)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  categorie TEXT NOT NULL,
  icone TEXT,
  description TEXT,
  ordre INTEGER NOT NULL DEFAULT 0,
  actif BOOLEAN NOT NULL DEFAULT true,
  prestations JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- ------------------------------------------------------------
-- Demandes / souscriptions de services (espace client)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES services(id),
  prestation_id TEXT,
  description TEXT NOT NULL,
  urgence TEXT NOT NULL DEFAULT 'normale' CHECK (urgence IN ('faible', 'normale', 'haute')),
  informations_complementaires TEXT,
  pieces_jointes JSONB NOT NULL DEFAULT '[]'::jsonb,
  statut TEXT NOT NULL DEFAULT 'Nouvelle demande'
    CHECK (statut IN ('Nouvelle demande', 'En cours', 'En attente d''informations', 'Traitée', 'Clôturée')),
  date_creation TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_mise_a_jour TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(user_id);

-- ------------------------------------------------------------
-- Messages (formulaire de contact public + messages espace client)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nom TEXT,
  email TEXT,
  telephone TEXT,
  service_id TEXT REFERENCES services(id),
  message TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT false,
  date_envoi TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);

-- ============================================================
-- SARGI SOCIAL HUB — nouvelles tables
-- ============================================================

-- ------------------------------------------------------------
-- Portfolio développeur (projets de Jordann, gérés en admin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  tech_stack TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'realise' CHECK (status IN ('realise', 'avenir')),
  demo_url TEXT,
  repo_url TEXT,
  screenshot_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Comptes sociaux — séparation stricte portfolio perso / client
-- ------------------------------------------------------------
-- owner_scope distingue sans ambiguïté à qui appartient le compte :
-- 'portfolio' = identité professionnelle de Jordann (ex: son LinkedIn perso)
-- 'client'    = comptes que le client (SARGI) a explicitement autorisés
-- Cette colonne est la garde-fou technique qui empêche de mélanger
-- les autorisations personnelles et celles du client (exigence du
-- cahier des charges, section D).
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_scope TEXT NOT NULL CHECK (owner_scope IN ('portfolio', 'client')),
  display_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'facebook', 'youtube')),
  account_type TEXT NOT NULL CHECK (account_type IN ('personal_profile', 'organization_page')),
  external_url TEXT,
  external_id TEXT,
  connection_status TEXT NOT NULL DEFAULT 'disconnected'
    CHECK (connection_status IN ('disconnected', 'connected', 'expired', 'revoked', 'error')),
  granted_scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  available_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_synced_at TIMESTAMPTZ,
  connected_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_social_accounts_scope ON social_accounts(owner_scope);

-- ------------------------------------------------------------
-- Jetons OAuth — table séparée, jamais exposée au frontend
-- ------------------------------------------------------------
-- Les valeurs access_token/refresh_token sont chiffrées en
-- application (AES-256-GCM, backend/src/utils/crypto.js) avant
-- d'être écrites ici : la base ne contient jamais de secret en clair.
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_type TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_tokens_account ON oauth_tokens(social_account_id);

-- ------------------------------------------------------------
-- Publications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  author_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  media_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'BROUILLON'
    CHECK (status IN ('BROUILLON', 'PROGRAMMEE', 'EN_COURS', 'PUBLIEE', 'ECHEC', 'ANNULEE')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT,
  platform_post_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_publications_account ON publications(social_account_id);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_publications_scheduled ON publications(scheduled_at) WHERE status = 'PROGRAMMEE';

-- ------------------------------------------------------------
-- Historique des tentatives de publication/programmation
-- ------------------------------------------------------------
-- Exigence explicite du cahier des charges : la programmation ne doit
-- jamais dépendre uniquement d'un minuteur navigateur, et chaque
-- tentative (succès ou échec) doit être tracée côté serveur.
CREATE TABLE IF NOT EXISTS publication_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  result TEXT NOT NULL CHECK (result IN ('success', 'failure')),
  http_status INTEGER,
  error_message TEXT
);
CREATE INDEX IF NOT EXISTS idx_attempts_publication ON publication_attempts(publication_id);

-- ------------------------------------------------------------
-- Journal d'audit des actions sensibles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
