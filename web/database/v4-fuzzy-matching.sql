-- v4.0 Fuzzy Matching Core Updates

-- 1. Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Zuordnung
  tenant_id TEXT NOT NULL, -- z.B. "verwaltung-a"
  
  -- Mieter-Stammdaten
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  unit TEXT NOT NULL, -- "3. OG links", "Whg 12"
  
  -- Metadata
  email TEXT,
  notes TEXT,
  
  UNIQUE(tenant_id, phone, unit)
);

-- 3. Add match metadata columns to tickets table
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS raw_caller_name TEXT,
ADD COLUMN IF NOT EXISTS raw_caller_address TEXT,
ADD COLUMN IF NOT EXISTS tenant_match_type TEXT DEFAULT 'NO_MATCH',
ADD COLUMN IF NOT EXISTS match_confidence NUMERIC(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS matched_tenant_id UUID REFERENCES tenants(id),
ADD COLUMN IF NOT EXISTS requires_manual_review BOOLEAN DEFAULT false;

-- 4. Create Fuzzy Search Function
CREATE OR REPLACE FUNCTION fuzzy_tenant_search(
  p_tenant_id TEXT,
  p_name TEXT,
  p_address TEXT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  phone TEXT,
  unit TEXT,
  name_similarity REAL,
  address_similarity REAL,
  combined_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.address,
    t.phone,
    t.unit,
    similarity(t.name, p_name) AS name_similarity,
    similarity(t.address, p_address) AS address_similarity,
    -- Adresse wird höher gewichtet (stabileres STT-Signal)
    (similarity(t.name, p_name) * 0.3 + similarity(t.address, p_address) * 0.7) AS combined_score
  FROM tenants t
  WHERE t.tenant_id = p_tenant_id
    AND (
      similarity(t.name, p_name) > 0.3
      OR similarity(t.address, p_address) > 0.5
    )
  ORDER BY combined_score DESC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql;

-- 5. Create Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_name_trgm ON tenants USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tenants_address_trgm ON tenants USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tenants_phone ON tenants (tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_tickets_manual_review ON tickets (requires_manual_review, created_at DESC) WHERE requires_manual_review = true;

-- 6. Comments
COMMENT ON COLUMN tickets.tenant_match_type IS 'Type of tenant match: PHONE_EXACT, FUZZY_HIGH, FUZZY_LOW, NO_MATCH';
COMMENT ON COLUMN tickets.match_confidence IS 'Confidence score (0.00-1.00) for fuzzy matches';
