-- ============================================================
-- SCHRITT 1: AUFRÄUMEN - Policies und Funktionen löschen
-- ============================================================

-- Alle RLS Policies löschen
DROP POLICY IF EXISTS "Users can view organization tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create organization tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update organization tickets" ON tickets;
DROP POLICY IF EXISTS "Users can view their organization" ON tenants;
DROP POLICY IF EXISTS "Users can update their organization" ON tenants;
DROP POLICY IF EXISTS "Users can create organizations" ON tenants;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own organization" ON tenants;
DROP POLICY IF EXISTS "Users can update their own organization" ON tenants;
DROP POLICY IF EXISTS "Users can view organization tenants" ON tenants;
DROP POLICY IF EXISTS "Users can create organization tenants" ON tenants;
DROP POLICY IF EXISTS "Users can update organization tenants" ON tenants;
DROP POLICY IF EXISTS "Users can delete organization tenants" ON tenants;

-- Bestehende Funktionen löschen
DROP FUNCTION IF EXISTS get_user_organization(uuid);
DROP FUNCTION IF EXISTS get_organization_by_vapi_phone(text);

-- RLS temporär deaktivieren
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

SELECT 'Schritt 1 abgeschlossen: Policies und Funktionen gelöscht' as status;