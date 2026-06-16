-- ============================================================
-- SCHRITT 3: ORGANIZATIONS TABELLE ERSTELLEN
-- ============================================================

-- Lösche falls bereits vorhanden
DROP TABLE IF EXISTS organizations CASCADE;

-- Erstelle die neue Organizations-Tabelle
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  vapi_phone_id TEXT,
  notification_email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_organizations_vapi_phone_id ON organizations(vapi_phone_id) WHERE vapi_phone_id IS NOT NULL;
CREATE INDEX idx_organizations_slug ON organizations(slug);

SELECT 'Schritt 3 abgeschlossen: Organizations-Tabelle erstellt' as status;