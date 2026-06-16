-- ============================================================
-- SCHRITT 6: HELPER FUNCTIONS UND TRIGGER
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

SELECT 'Schritt 6 abgeschlossen: Funktionen und Trigger erstellt' as status;