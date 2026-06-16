-- ============================================================
-- CALLFOLIO v5.2 - CLEAN ARCHITECTURE SETUP (FIXED)
-- ============================================================
-- Dieses Skript bereinigt die fehlerhafte Architektur und 
-- erstellt eine saubere Trennung zwischen:
--   - organizations: Hausverwaltungen (du als Kunde)
--   - tenants: Mieter (die Bewohner, die anrufen)
-- ============================================================

-- ============================================================
-- SCHRITT 1: ALLE RLS POLICIES LÖSCHEN (verhindert Abhängigkeiten)
-- ============================================================

-- Lösche alle bestehenden Policies
DROP POLICY IF EXISTS "Users can view organization tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create organization tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update organization tickets" ON tickets;
DROP POLICY IF EXISTS "Users can view their organization" ON tenants;
DROP POLICY IF EXISTS "Users can update their organization" ON tenants;
DROP POLICY IF EXISTS "Users can create organizations" ON tenants;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Weitere mögliche Policy-Namen
DROP POLICY IF EXISTS "Users can view their own organization" ON tenants;
DROP POLICY IF EXISTS "Users can update their own organization" ON tenants;

-- ============================================================
-- SCHRITT 2: VOLLSTÄNDIGE BEREINIGUNG
-- ============================================================

-- RLS temporär deaktivieren
ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Lösche alle Daten (werden neu erstellt)
TRUNCATE TABLE tickets CASCADE;
TRUNCATE TABLE tenants CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Lösche ticket_activities falls vorhanden
DROP TABLE IF EXISTS ticket_activities CASCADE;

-- ============================================================
-- SCHRITT 3: ORGANIZATIONS TABELLE ERSTELLEN
-- ============================================================

-- Lösche falls bereits vorhanden
DROP TABLE IF EXISTS organizations CASCADE;

-- Erstelle die neue Organizations-Tabelle
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identifikation
  slug TEXT UNIQUE NOT NULL,  -- z.B. "akdeniz-gmbh" (URL-freundlich)
  name TEXT NOT NULL,         -- z.B. "Hausverwaltung Akdeniz GmbH"
  
  -- Vapi Integration
  vapi_phone_id TEXT,         -- Die Vapi Phone Number ID
  
  -- Benachrichtigungen
  notification_email TEXT,    -- E-Mail für Ticket-Benachrichtigungen
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  subscription_tier TEXT DEFAULT 'free',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelle Vapi-Lookups
CREATE INDEX idx_organizations_vapi_phone_id 
  ON organizations(vapi_phone_id) 
  WHERE vapi_phone_id IS NOT NULL;

-- Index für slug
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ============================================================
-- SCHRITT 4: TENANTS TABELLE BEREINIGEN
-- ============================================================

-- Entferne die Organisations-Spalten aus tenants (gehören da nicht hin!)
ALTER TABLE tenants DROP COLUMN IF EXISTS vapi_phone_id CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS notification_email CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS is_active CASCADE;
ALTER TABLE tenants DROP COLUMN IF EXISTS subscription_tier CASCADE;

-- Füge organization_id hinzu (Fremdschlüssel zur Organization)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Index für schnelle Mieter-Lookups pro Organisation
CREATE INDEX IF NOT EXISTS idx_tenants_organization_id ON tenants(organization_id);

-- ============================================================
-- SCHRITT 5: PROFILES TABELLE ANPASSEN
-- ============================================================

-- Lösche die alte tenant_id Spalte (CASCADE entfernt Abhängigkeiten)
ALTER TABLE profiles DROP COLUMN IF EXISTS tenant_id CASCADE;

-- Füge organization_id hinzu
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- ============================================================
-- SCHRITT 6: TICKETS TABELLE ANPASSEN
-- ============================================================

-- Tickets gehören zu einer Organization (nicht tenant_id als String!)
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Index
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets(organization_id);

-- ============================================================
-- SCHRITT 7: ROW LEVEL SECURITY (RLS) NEU AUFSETZEN
-- ============================================================

-- RLS wieder aktivieren
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- RLS für profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS für organizations
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- RLS für tenants (Mieter)
CREATE POLICY "Users can view organization tenants" ON tenants
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create organization tenants" ON tenants
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update organization tenants" ON tenants
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete organization tenants" ON tenants
  FOR DELETE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

-- RLS für tickets
CREATE POLICY "Users can view organization tickets" ON tickets
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create organization tickets" ON tickets
  FOR INSERT WITH CHECK (true);  -- Webhook muss Tickets erstellen können

CREATE POLICY "Users can update organization tickets" ON tickets
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================================
-- SCHRITT 8: HELPER FUNCTIONS
-- ============================================================

-- Funktion: Organisation eines Users abrufen
CREATE OR REPLACE FUNCTION get_user_organization(user_uuid UUID)
RETURNS TABLE(
  organization_id UUID,
  organization_name TEXT,
  organization_slug TEXT,
  vapi_phone_id TEXT,
  notification_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as organization_id,
    o.name as organization_name,
    o.slug as organization_slug,
    o.vapi_phone_id,
    o.notification_email
  FROM profiles p
  JOIN organizations o ON p.organization_id = o.id
  WHERE p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion: Organisation per Vapi Phone ID finden
CREATE OR REPLACE FUNCTION get_organization_by_vapi_phone(phone_id TEXT)
RETURNS TABLE(
  organization_id UUID,
  organization_name TEXT,
  organization_slug TEXT,
  notification_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as organization_id,
    o.name as organization_name,
    o.slug as organization_slug,
    o.notification_email
  FROM organizations o
  WHERE o.vapi_phone_id = phone_id
  AND o.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SCHRITT 9: TRIGGER FÜR NEUE USER
-- ============================================================

-- Trigger-Funktion: Profil für neue User erstellen
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger neu erstellen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SCHRITT 10: KOMMENTARE FÜR DOKUMENTATION
-- ============================================================

COMMENT ON TABLE organizations IS 'Hausverwaltungen/Kunden - NICHT Mieter!';
COMMENT ON TABLE tenants IS 'Mieter/Bewohner - die Personen, die anrufen';
COMMENT ON TABLE profiles IS 'User-Profile, verknüpft auth.users mit organizations';
COMMENT ON TABLE tickets IS 'Support-Tickets von Mietern';

COMMENT ON COLUMN organizations.slug IS 'URL-freundlicher Identifier (z.B. akdeniz-gmbh)';
COMMENT ON COLUMN organizations.vapi_phone_id IS 'Vapi Phone Number ID für Voice-Routing';
COMMENT ON COLUMN organizations.notification_email IS 'E-Mail für Ticket-Benachrichtigungen';

COMMENT ON COLUMN tenants.organization_id IS 'Zu welcher Hausverwaltung gehört dieser Mieter?';
COMMENT ON COLUMN tenants.canonical_address IS 'Normalisierte Adresse für Fuzzy-Matching';

-- ============================================================
-- FERTIG!
-- ============================================================

SELECT '✅ CLEAN ARCHITECTURE SETUP COMPLETE!' as status,
       'Nächste Schritte:' as info,
       '1. Registriere dich neu in der App' as step1,
       '2. Erstelle deine Organisation im Onboarding' as step2,
       '3. Importiere die Mieter per CSV' as step3;