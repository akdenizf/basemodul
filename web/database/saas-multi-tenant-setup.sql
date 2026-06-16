-- CALLFOLIO SAAS MULTI-TENANT SETUP
-- Execute this script in Supabase SQL Editor to enable multi-tenant SaaS functionality
-- This creates the user profiles system and organization management

-- STEP 1: Clean existing test data for fresh start
DELETE FROM tickets WHERE tenant_id = 'test-verwaltung' OR tenant_id = 'demo-verwaltung';
DELETE FROM tenants WHERE tenant_id = 'test-verwaltung' OR tenant_id = 'demo-verwaltung';

-- STEP 2: Enhance tenants table to be organizations table
-- Add vapi_phone_id for organization-specific Vapi integration
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS vapi_phone_id TEXT;

-- Add organization-specific fields
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

-- STEP 3: Create profiles table for user-organization relationship
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One profile per user for now
);

-- STEP 4: Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- STEP 5: RLS Policies for profiles table
-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STEP 6: RLS Policies for tenants table (organizations)
-- Users can only see their own organization
CREATE POLICY "Users can view their organization" ON tenants
  FOR SELECT USING (
    id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can update their own organization
CREATE POLICY "Users can update their organization" ON tenants
  FOR UPDATE USING (
    id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid())
  );

-- Users can create new organizations
CREATE POLICY "Users can create organizations" ON tenants
  FOR INSERT WITH CHECK (true);

-- STEP 7: RLS Policies for tickets table
-- Users can only see tickets from their organization
CREATE POLICY "Users can view organization tickets" ON tickets
  FOR SELECT USING (
    tenant_id IN (
      SELECT t.tenant_id::text 
      FROM profiles p 
      JOIN tenants t ON p.tenant_id = t.id 
      WHERE p.user_id = auth.uid()
    )
  );

-- Users can create tickets for their organization
CREATE POLICY "Users can create organization tickets" ON tickets
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT t.tenant_id::text 
      FROM profiles p 
      JOIN tenants t ON p.tenant_id = t.id 
      WHERE p.user_id = auth.uid()
    )
  );

-- Users can update tickets from their organization
CREATE POLICY "Users can update organization tickets" ON tickets
  FOR UPDATE USING (
    tenant_id IN (
      SELECT t.tenant_id::text 
      FROM profiles p 
      JOIN tenants t ON p.tenant_id = t.id 
      WHERE p.user_id = auth.uid()
    )
  );

-- STEP 8: Function to handle new user registration
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

-- STEP 9: Trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STEP 10: Helper function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization(user_uuid UUID)
RETURNS TABLE(
  organization_id UUID,
  organization_name TEXT,
  tenant_id_string TEXT,
  vapi_phone_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as organization_id,
    t.name as organization_name,
    t.tenant_id as tenant_id_string,
    t.vapi_phone_id
  FROM profiles p
  JOIN tenants t ON p.tenant_id = t.id
  WHERE p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 11: Update updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- STEP 12: Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenants_vapi_phone_id ON tenants(vapi_phone_id) WHERE vapi_phone_id IS NOT NULL;

-- STEP 13: Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles linking auth.users to organizations (tenants)';
COMMENT ON COLUMN profiles.tenant_id IS 'Reference to organization (tenants table)';
COMMENT ON COLUMN tenants.vapi_phone_id IS 'Vapi Phone Number ID for organization-specific voice routing';
COMMENT ON COLUMN tenants.tenant_id IS 'String identifier for organization (legacy compatibility)';

-- SUCCESS MESSAGE
SELECT 'SAAS MULTI-TENANT SETUP COMPLETE!' as status,
       'Users can now register, create organizations, and access isolated data.' as message;