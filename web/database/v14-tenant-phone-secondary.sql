-- v14: Add phone_secondary to tenants for multi-number lookup
-- Allows get_caller_context to match callers who registered a secondary number.

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone_secondary TEXT;

CREATE INDEX IF NOT EXISTS idx_tenants_phone_secondary
  ON tenants (phone_secondary)
  WHERE phone_secondary IS NOT NULL;

COMMENT ON COLUMN tenants.phone_secondary IS 'Optional secondary phone number for caller identification (e.g. work or family number)';
