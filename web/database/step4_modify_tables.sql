-- ============================================================
-- SCHRITT 4: BESTEHENDE TABELLEN ANPASSEN
-- ============================================================

-- TENANTS: Organisations-Spalten entfernen
ALTER TABLE tenants DROP COLUMN IF EXISTS vapi_phone_id CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS notification_email CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS is_active CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS subscription_tier CASCADE;

-- TENANTS: organization_id hinzufügen
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_tenants_organization_id ON tenants(organization_id);

-- PROFILES: tenant_id entfernen, organization_id hinzufügen
ALTER TABLE profiles DROP COLUMN IF EXISTS tenant_id CASCADE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- TICKETS: organization_id hinzufügen
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets(organization_id);

SELECT 'Schritt 4 abgeschlossen: Tabellen angepasst' as status;