-- ============================================================
-- V10: BILLING INFRASTRUCTURE
-- New pricing tiers: starter (89€/100 calls), pro (199€/300 calls), enterprise
-- Adds call counting, monthly reset, Stripe stubs, overage tracking
-- ============================================================

-- 1. Plan fields on organizations
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'starter'
    CHECK (plan_tier IN ('starter', 'pro', 'enterprise', 'free'));

-- call_limit: NULL = unlimited (enterprise). Default 100 for new orgs.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS call_limit INTEGER DEFAULT 100;

-- current_month_calls: incremented atomically via increment_monthly_calls().
-- Reset to 0 on billing_cycle_start by external cron.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS current_month_calls INTEGER NOT NULL DEFAULT 0;

-- billing_cycle_start: timestamp when the current counter period began.
-- Used by cron job to determine when to reset.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMPTZ DEFAULT date_trunc('month', NOW());

-- setup_completed: set to TRUE after onboarding call is done.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- setup_fee_paid: TRUE once the 990€ onboarding fee is confirmed.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS setup_fee_paid BOOLEAN NOT NULL DEFAULT FALSE;

-- Stripe stubs (wired when Stripe integration is built)
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Overage rate per additional call beyond plan limit.
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS overage_per_call NUMERIC(10, 2) NOT NULL DEFAULT 0.80;

-- 2. Map existing subscription_tier → plan_tier for live orgs
-- (subscription_tier was 'free' by default; treat those as 'starter')
UPDATE organizations
SET plan_tier = CASE
  WHEN subscription_tier = 'pro'        THEN 'pro'
  WHEN subscription_tier = 'enterprise' THEN 'enterprise'
  ELSE 'starter'
END
WHERE plan_tier = 'starter'; -- only update rows still at default

-- Set call_limit based on plan_tier for existing orgs
UPDATE organizations
SET call_limit = CASE
  WHEN plan_tier = 'starter'    THEN 100
  WHEN plan_tier = 'pro'        THEN 300
  WHEN plan_tier = 'enterprise' THEN NULL  -- NULL = unlimited
  ELSE 100
END;

-- 3. Index for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer
  ON organizations(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- 4. Atomic increment RPC — use this instead of read-then-write in application code
CREATE OR REPLACE FUNCTION increment_monthly_calls(org_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE organizations
  SET current_month_calls = current_month_calls + 1,
      updated_at           = NOW()
  WHERE id = org_id;
$$;

-- 5. Monthly reset function — invoke via Supabase cron (pg_cron)
--    Suggested cron schedule: '0 0 1 * *' (midnight on 1st of each month)
--
--    To register (run once in Supabase SQL editor):
--    SELECT cron.schedule(
--      'reset-monthly-call-counts',
--      '0 0 1 * *',
--      $$ SELECT reset_monthly_call_counts(); $$
--    );
CREATE OR REPLACE FUNCTION reset_monthly_call_counts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE organizations
  SET current_month_calls = 0,
      billing_cycle_start  = date_trunc('month', NOW()),
      updated_at           = NOW();
$$;

-- 6. Helper view: organizations with overage status (useful for admin dashboard)
CREATE OR REPLACE VIEW organization_billing_status AS
SELECT
  id,
  name,
  slug,
  plan_tier,
  call_limit,
  current_month_calls,
  overage_per_call,
  CASE
    WHEN call_limit IS NULL THEN false
    ELSE current_month_calls > call_limit
  END AS is_over_limit,
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
