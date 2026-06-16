-- ============================================================
-- V11: DURATION TRACKING (Free Minutes)
-- Adds precise duration tracking to organizations and tickets.
-- ============================================================

-- 1. Duration fields on organizations
-- duration_limit_minutes: NULL = unlimited. Default depends on plan.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS duration_limit_minutes INTEGER;

-- current_month_duration_seconds: actual duration consumed in the current period.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS current_month_duration_seconds INTEGER NOT NULL DEFAULT 0;

-- 2. Duration on tickets (to track specific call cost/time)
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS total_duration_seconds_all_time BIGINT NOT NULL DEFAULT 0;

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- 3. Update existing call limits to include duration defaults
-- Starter: 100 calls OR ~300 minutes (based on 3min avg)
-- Pro: 300 calls OR ~900 minutes
UPDATE organizations
SET duration_limit_minutes = CASE
  WHEN plan_tier = 'starter'    THEN 300
  WHEN plan_tier = 'pro'        THEN 900
  WHEN plan_tier = 'enterprise' THEN NULL
  ELSE 300
END
WHERE duration_limit_minutes IS NULL;

-- 4. RPC to add duration (called when call ends)
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

-- 5. Update the billing view to include minutes tracking
DROP VIEW IF EXISTS organization_billing_status;
CREATE OR REPLACE VIEW organization_billing_status AS
SELECT
  id,
  name,
  slug,
  plan_tier,
  call_limit,
  current_month_calls,
  duration_limit_minutes,
  ROUND(current_month_duration_seconds / 60.0, 2) as current_month_minutes,
  overage_per_call,
  CASE
    WHEN call_limit IS NULL THEN false
    ELSE current_month_calls > call_limit
  END AS is_calls_over_limit,
  CASE
    WHEN duration_limit_minutes IS NULL THEN false
    ELSE (current_month_duration_seconds / 60.0) > duration_limit_minutes
  END AS is_duration_over_limit,
  billing_cycle_start,
  setup_completed,
  setup_fee_paid,
  stripe_customer_id
FROM organizations
WHERE is_active = TRUE;
