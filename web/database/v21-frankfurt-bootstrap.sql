-- CALLFOLIO v21 - Fresh Frankfurt project bootstrap
-- Purpose: create the current Callfolio schema in a new empty Supabase project.
-- No customer/test data is inserted, except default emergency keywords.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_urgency AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_category AS ENUM ('PLUMBING', 'HEATING', 'ELECTRICAL', 'BUILDING', 'ADMIN', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_sentiment AS ENUM ('CALM', 'STRESSED', 'ANGRY', 'UNKNOWN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  vapi_phone_id TEXT,
  notification_email TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  subscription_tier TEXT DEFAULT 'free',
  plan_tier TEXT DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'pro', 'enterprise', 'free')),
  call_limit INTEGER DEFAULT 100,
  current_month_calls INTEGER NOT NULL DEFAULT 0,
  billing_cycle_start TIMESTAMPTZ DEFAULT date_trunc('month', NOW()),
  setup_completed BOOLEAN NOT NULL DEFAULT FALSE,
  setup_fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  overage_per_call NUMERIC(10, 2) NOT NULL DEFAULT 0.80,
  duration_limit_minutes INTEGER,
  current_month_duration_seconds INTEGER NOT NULL DEFAULT 0,
  total_duration_seconds_all_time BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  first_name TEXT,
  last_name TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  phone_secondary TEXT,
  email TEXT,
  street TEXT,
  house_number TEXT,
  zip TEXT,
  city TEXT,
  address TEXT,
  unit TEXT,
  canonical_address TEXT,
  notes TEXT,
  registration_source TEXT DEFAULT 'MANUAL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  trade TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  call_id TEXT UNIQUE NOT NULL,
  ticket_id TEXT,
  ticket_code VARCHAR(6) UNIQUE,
  status ticket_status DEFAULT 'NEW',
  urgency ticket_urgency NOT NULL,
  category ticket_category NOT NULL,
  sentiment ticket_sentiment NOT NULL DEFAULT 'UNKNOWN',
  caller_name TEXT,
  caller_phone TEXT,
  address TEXT,
  unit TEXT,
  issue_summary TEXT,
  issue_details TEXT,
  escalation_is_emergency BOOLEAN DEFAULT FALSE,
  escalation_reason TEXT,
  duplicate_of UUID REFERENCES tickets(id),
  parent_ticket_id UUID REFERENCES tickets(id),
  raw_caller_name TEXT,
  raw_caller_address TEXT,
  tenant_match_type TEXT DEFAULT 'NO_MATCH',
  match_type TEXT,
  match_confidence NUMERIC(3,2) DEFAULT 0.00,
  matched_tenant_id UUID REFERENCES tenants(id),
  requires_manual_review BOOLEAN DEFAULT FALSE,
  vapi_cost NUMERIC(10,4),
  ticket_json JSONB,
  is_archived BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  match_status TEXT,
  final_caller_name TEXT,
  contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
  appointment_date TIMESTAMPTZ,
  contractor_confirmed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  admin_email TEXT,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communication_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  subject TEXT DEFAULT '',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

CREATE TABLE IF NOT EXISTS organization_settings (
  organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  sender_signature TEXT NOT NULL DEFAULT 'Mit freundlichen Gruessen
Ihre Hausverwaltung',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergency_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'de',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code VARCHAR(6);
  attempt_count INTEGER := 0;
BEGIN
  IF NEW.ticket_code IS NULL THEN
    LOOP
      new_code := LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 6, '0');
      IF NOT EXISTS (SELECT 1 FROM tickets WHERE ticket_code = new_code) THEN
        NEW.ticket_code := new_code;
        EXIT;
      END IF;
      attempt_count := attempt_count + 1;
      IF attempt_count >= 100 THEN
        RAISE EXCEPTION 'Could not generate unique ticket code after 100 attempts';
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
BEGIN
  IF NEW.ticket_id IS NULL THEN
    year_suffix := RIGHT(EXTRACT(YEAR FROM NOW())::TEXT, 2);
    SELECT COALESCE(MAX(
      CASE
        WHEN ticket_id ~ ('^HV-' || year_suffix || '-[0-9]+$')
        THEN SUBSTRING(ticket_id FROM LENGTH('HV-' || year_suffix || '-') + 1)::INTEGER
        ELSE 0
      END
    ), 0) + 1
    INTO sequence_num
    FROM tickets
    WHERE tenant_id = NEW.tenant_id
      AND ticket_id IS NOT NULL;

    NEW.ticket_id := 'HV-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_ticket_code_trigger ON tickets;
CREATE TRIGGER generate_ticket_code_trigger
  BEFORE INSERT ON tickets
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_code();

DROP TRIGGER IF EXISTS generate_ticket_id_trigger ON tickets;
CREATE TRIGGER generate_ticket_id_trigger
  BEFORE INSERT ON tickets
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_id();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  )
  ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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
  SELECT o.id, o.name, o.slug, o.vapi_phone_id, o.notification_email
  FROM profiles p
  JOIN organizations o ON p.organization_id = o.id
  WHERE p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_organization_by_vapi_phone(phone_id TEXT)
RETURNS TABLE(
  organization_id UUID,
  organization_name TEXT,
  organization_slug TEXT,
  notification_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.name, o.slug, o.notification_email
  FROM organizations o
  WHERE o.vapi_phone_id = phone_id
    AND o.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_monthly_calls(org_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE organizations
  SET current_month_calls = current_month_calls + 1,
      updated_at = NOW()
  WHERE id = org_id;
$$;

CREATE OR REPLACE FUNCTION add_call_duration(org_id UUID, seconds INTEGER)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE organizations
  SET current_month_duration_seconds = current_month_duration_seconds + seconds,
      total_duration_seconds_all_time = total_duration_seconds_all_time + seconds,
      updated_at = NOW()
  WHERE id = org_id;
$$;

CREATE OR REPLACE FUNCTION reset_monthly_call_counts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE organizations
  SET current_month_calls = 0,
      current_month_duration_seconds = 0,
      billing_cycle_start = date_trunc('month', NOW()),
      updated_at = NOW();
$$;

CREATE OR REPLACE FUNCTION match_tenant(
  search_phone TEXT,
  search_name TEXT,
  search_address TEXT
)
RETURNS TABLE(
  id UUID,
  tenant_id TEXT,
  name TEXT,
  phone TEXT,
  address TEXT,
  unit TEXT,
  email TEXT,
  similarity_score NUMERIC
) AS $$
BEGIN
  IF search_phone IS NOT NULL AND search_phone != '' THEN
    RETURN QUERY
    SELECT t.id, t.tenant_id, t.name, t.phone, t.address, t.unit, t.email, 1.0::NUMERIC
    FROM tenants t
    WHERE t.phone = search_phone OR t.phone_secondary = search_phone
    ORDER BY t.created_at DESC
    LIMIT 1;

    IF FOUND THEN
      RETURN;
    END IF;
  END IF;

  RETURN QUERY
  SELECT
    t.id,
    t.tenant_id,
    t.name,
    t.phone,
    t.address,
    t.unit,
    t.email,
    (
      COALESCE(similarity(t.name, search_name), 0) * 0.4 +
      COALESCE(similarity(t.address, search_address), 0) * 0.6
    )::NUMERIC AS similarity_score
  FROM tenants t
  WHERE COALESCE(similarity(t.name, search_name), 0) > 0.2
     OR COALESCE(similarity(t.address, search_address), 0) > 0.3
  ORDER BY similarity_score DESC, t.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fuzzy_tenant_search(
  search_tenant_id TEXT,
  search_name TEXT,
  search_address TEXT
)
RETURNS TABLE(
  id UUID,
  tenant_id TEXT,
  name TEXT,
  phone TEXT,
  address TEXT,
  unit TEXT,
  email TEXT,
  combined_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.tenant_id,
    t.name,
    t.phone,
    t.address,
    t.unit,
    t.email,
    GREATEST(
      COALESCE(similarity(t.name, search_name), 0),
      COALESCE(similarity(t.address, search_address), 0)
    )::NUMERIC AS combined_score
  FROM tenants t
  WHERE t.tenant_id = search_tenant_id
  ORDER BY combined_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION detect_emergency_keywords(text_input TEXT)
RETURNS TABLE(
  is_emergency BOOLEAN,
  matched_keywords TEXT[],
  categories TEXT[]
) AS $$
DECLARE
  matched_kw TEXT[];
  matched_cat TEXT[];
BEGIN
  SELECT ARRAY_AGG(ek.keyword), ARRAY_AGG(DISTINCT ek.category)
  INTO matched_kw, matched_cat
  FROM emergency_keywords ek
  WHERE ek.is_active = TRUE
    AND LOWER(text_input) LIKE '%' || LOWER(ek.keyword) || '%';

  RETURN QUERY SELECT
    COALESCE(array_length(matched_kw, 1) > 0, FALSE),
    COALESCE(matched_kw, ARRAY[]::TEXT[]),
    COALESCE(matched_cat, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_ticket_archived(ticket_id UUID, archived BOOLEAN)
RETURNS TABLE(id UUID, is_archived BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE tickets
  SET is_archived = archived,
      updated_at = NOW()
  WHERE tickets.id = ticket_id
  RETURNING tickets.id, tickets.is_archived;
END;
$$;

CREATE OR REPLACE FUNCTION get_enum_values()
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'ticket_status', enum_range(NULL::ticket_status)::TEXT[],
    'ticket_urgency', enum_range(NULL::ticket_urgency)::TEXT[],
    'ticket_category', enum_range(NULL::ticket_category)::TEXT[],
    'ticket_sentiment', enum_range(NULL::ticket_sentiment)::TEXT[]
  );
$$;

CREATE OR REPLACE VIEW ticket_details AS
SELECT
  t.*,
  orig.ticket_code AS original_ticket_code,
  orig.issue_summary AS original_summary,
  parent.ticket_code AS parent_ticket_code,
  parent.issue_summary AS parent_summary
FROM tickets t
LEFT JOIN tickets orig ON t.duplicate_of = orig.id
LEFT JOIN tickets parent ON t.parent_ticket_id = parent.id;

CREATE OR REPLACE VIEW organization_billing_status AS
SELECT
  id,
  name,
  slug,
  plan_tier,
  call_limit,
  current_month_calls,
  duration_limit_minutes,
  ROUND(current_month_duration_seconds / 60.0, 2) AS current_month_minutes,
  total_duration_seconds_all_time,
  overage_per_call,
  CASE WHEN call_limit IS NULL THEN FALSE ELSE current_month_calls > call_limit END AS is_calls_over_limit,
  CASE WHEN duration_limit_minutes IS NULL THEN FALSE ELSE (current_month_duration_seconds / 60.0) > duration_limit_minutes END AS is_duration_over_limit,
  CASE
    WHEN call_limit IS NULL OR current_month_calls <= call_limit THEN 0
    ELSE (current_month_calls - call_limit) * overage_per_call
  END AS overage_amount_eur,
  billing_cycle_start,
  setup_completed,
  setup_fee_paid,
  stripe_customer_id,
  stripe_subscription_id
FROM organizations
WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_organizations_vapi_phone_id ON organizations(vapi_phone_id) WHERE vapi_phone_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer ON organizations(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX IF NOT EXISTS idx_tenants_name_trgm ON tenants USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tenants_address_trgm ON tenants USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tenants_phone ON tenants (tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_tenants_phone_secondary ON tenants (phone_secondary) WHERE phone_secondary IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_last_name ON tenants (last_name) WHERE last_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_registration_source ON tenants (registration_source);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_canonical_address ON tenants (tenant_id, canonical_address);
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_created ON tickets(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_call_id ON tickets(call_id);
CREATE INDEX IF NOT EXISTS idx_tickets_phone_status ON tickets(caller_phone, status) WHERE status IN ('NEW', 'IN_PROGRESS');
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON tickets(ticket_code) WHERE ticket_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_duplicate_of ON tickets(duplicate_of) WHERE duplicate_of IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_manual_review ON tickets(requires_manual_review, created_at DESC) WHERE requires_manual_review = TRUE;
CREATE INDEX IF NOT EXISTS idx_tickets_is_archived ON tickets(is_archived);
CREATE INDEX IF NOT EXISTS idx_tickets_processed_at ON tickets(processed_at) WHERE processed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_match_type ON tickets(match_type);
CREATE INDEX IF NOT EXISTS idx_tickets_contractor_id ON tickets(contractor_id) WHERE contractor_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS tickets_caller_phone_trgm_idx ON tickets USING gin (caller_phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tickets_address_trgm_idx ON tickets USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON tickets(status);
CREATE INDEX IF NOT EXISTS tickets_org_status_idx ON tickets(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_ticket_id ON ticket_activities(ticket_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_admin ON ticket_activities(admin_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_type ON ticket_activities(activity_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_emergency_keywords_active ON emergency_keywords(keyword) WHERE is_active = TRUE;

INSERT INTO emergency_keywords (keyword, category) VALUES
  ('112', 'emergency_number'),
  ('notfall', 'emergency'),
  ('feuer', 'fire'),
  ('brand', 'fire'),
  ('wasser', 'water'),
  ('ueberschwemmung', 'water'),
  ('gas', 'gas'),
  ('gasgeruch', 'gas'),
  ('unfall', 'accident'),
  ('verletzt', 'injury'),
  ('gefahr', 'danger'),
  ('hilfe', 'help'),
  ('sofort', 'urgency'),
  ('dringend', 'urgency'),
  ('lebensbedrohlich', 'life_threatening'),
  ('stromausfall', 'electrical'),
  ('kurzschluss', 'electrical')
ON CONFLICT (keyword) DO NOTHING;

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their organization" ON organizations
  FOR UPDATE USING (id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view organization tenants" ON tenants
  FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create organization tenants" ON tenants
  FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update organization tenants" ON tenants
  FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete organization tenants" ON tenants
  FOR DELETE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view organization tickets" ON tickets
  FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create organization tickets" ON tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update organization tickets" ON tickets
  FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authenticated users can read activities" ON ticket_activities
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can manage all activities" ON ticket_activities
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read attachments" ON ticket_attachments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can insert attachments" ON ticket_attachments
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete attachments" ON ticket_attachments
  FOR DELETE TO service_role
  USING (true);

CREATE POLICY "Users can view own org templates" ON communication_templates
  FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own org templates" ON communication_templates
  FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own org templates" ON communication_templates
  FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own org templates" ON communication_templates
  FOR DELETE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view organization contractors" ON contractors
  FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create organization contractors" ON contractors
  FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update organization contractors" ON contractors
  FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete organization contractors" ON contractors
  FOR DELETE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own organization settings" ON organization_settings
  FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own organization settings" ON organization_settings
  FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own organization settings" ON organization_settings
  FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "authenticated_read_emergency_keywords" ON emergency_keywords
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Public can read logos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Authenticated users can update logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'logos')
  WITH CHECK (bucket_id = 'logos');

GRANT EXECUTE ON FUNCTION set_ticket_archived(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION match_tenant(TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION fuzzy_tenant_search(TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_enum_values() TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';
