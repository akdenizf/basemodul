-- ============================================================
-- SCHRITT 5: RLS POLICIES ERSTELLEN
-- ============================================================

-- RLS wieder aktivieren
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORGANIZATIONS Policies
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

-- TENANTS Policies
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

-- TICKETS Policies
CREATE POLICY "Users can view organization tickets" ON tickets
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create organization tickets" ON tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update organization tickets" ON tickets
  FOR UPDATE USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())
  );

SELECT 'Schritt 5 abgeschlossen: RLS Policies erstellt' as status;