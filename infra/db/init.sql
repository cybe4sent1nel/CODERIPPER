-- Postgres schema: users, projects, runs, badges
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  hashed_password TEXT,
  created_at TIMESTAMP DEFAULT now(),
  gdpr_consent BOOL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES users(id),
  language TEXT NOT NULL,
  status TEXT NOT NULL,
  cpu_ms BIGINT,
  memory_bytes BIGINT,
  exit_code INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES users(id),
  badge_id TEXT REFERENCES badges(id),
  unlocked_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY(user_id,badge_id)
);
