-- ============================================================
-- CALLFOLIO v5.2 - CLEAN ARCHITECTURE SETUP
-- ============================================================
-- Dieses Skript bereinigt die fehlerhafte Architektur und 
-- erstellt eine saubere Trennung zwischen:
--   - organizations: Hausverwaltungen (du als Kunde)
--   - tenants: Mieter (die Bewohner, die anrufen)
-- ============================================================

-- ============================================================
-- SCHRITT 1: VOLLSTÄNDIGE BEREINIGUNG
-- ============================================================

-- Lösche alle Tickets (werden neu erstellt)
TRUNCATE TABLE tickets CASCADE;

-- Lösche alle Mieter (werden per CSV neu importiert)
TRUNCATE TABLE tenants CASCADE;

-- Lösche alle Profile (werden bei Neuregistrierung erstellt)
TRUNCATE TABLE profiles CASCADE;

-- Lösche ticket_activities falls vorhanden
TRUNCATE TABLE ticket_activities CASCADE;

-- ============================================================
-- SCHRITT 2: ORGANIZATIONS TABELLE ERSTELLEN
-- ============================================================

-- Erstelle die neue Organizations-Tabelle
CREATE TABLE IF NOT EXISTS organizations (
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
CREATE INDEX IF NOT EXISTS idx_organizations_vapi_phone_id 
  ON organizations(vapi_phone_id) 
  WHERE vapi_phone_id IS NOT NULL;

-- ============================================================
-- SCHRITT 3: TENANTS TABELLE BEREINIGEN
-- ============================================================

-- Entferne die Organisations-Spalten aus tenants (gehören da nicht hin!)
ALTER TABLE tenants DROP COLUMN IF EXISTS vapi_phone_id;
ALTER TABLE tenants DROP COLUMN IF EXISTS notification_email;
ALTER TABLE tenants DROP COLUMN IF EXISTS is_active;
ALTER TABLE tenants DROP COLUMN IF EXISTS subscription_tier;

-- Füge organization_id hinzu (Fremdschlüssel zur Organization)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Index für schnelle Mieter-Lookups pro Organisation
CREATE INDEX IF NOT EXISTS idx_tenants_organization_id ON tenants(organization_id);

-- ============================================================
-- SCHRITT 4: PROFILES TABELLE ANPASSEN
-- ============================================================

-- Ändere profiles: tenant_id → organization_id
ALTER TABLE profiles DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- ============================================================
-- SCHRITT 5: TICKETS TABELLE ANPASSEN
-- ============================================================

-- Tickets gehören zu einer Organization (nicht tenant_id als String!)
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Index
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets(organization_id);

-- ============================================================
-- SCHRITT 6: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- RLS für organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their organization" ON organizations;
CREATE POLICY "Users can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

-- RLS für tenants (Mieter)
DROP POLICY IF EXISTS "Users can view organization tenants" ON tenants;
CREATE POLICY "Users can view organization tenants" ON tenants
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create organization tenants" ON tenants;
CREATE POLICY "Users can create organization tenants" ON tenants
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update organization tenants" ON tenants;
CREATE POLICY "Users can update organization tenants" ON tenants
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete organization tenants" ON tenants;
CREATE POLICY "Users can delete organization tenants" ON tenants
  FOR DELETE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

-- RLS für tickets
DROP POLICY IF EXISTS "Users can view organization tickets" ON tickets;
CREATE POLICY "Users can view organization tickets" ON tickets
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create organization tickets" ON tickets;
CREATE POLICY "Users can create organization tickets" ON tickets
  FOR INSERT WITH CHECK (true);  -- Webhook muss Tickets erstellen können

DROP POLICY IF EXISTS "Users can update organization tickets" ON tickets;
CREATE POLICY "Users can update organization tickets" ON tickets
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================================
-- SCHRITT 7: HELPER FUNCTIONS
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
-- SCHRITT 8: TRIGGER FÜR NEUE USER
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
-- SCHRITT 9: KOMMENTARE FÜR DOKUMENTATION
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
