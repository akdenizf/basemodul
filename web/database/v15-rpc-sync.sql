-- ============================================================
-- V15: RPC SYNC — Idempotente Sicherung aller Live-RPCs
-- Führe diese Datei im Supabase SQL Editor aus.
-- Alle Statements sind idempotent (ADD COLUMN IF NOT EXISTS,
-- CREATE OR REPLACE) — kann ohne Risiko auf bestehenden DBs
-- wiederholt ausgeführt werden.
-- ============================================================
-- Betroffene RPC-Calls im Code:
--   1. increment_monthly_calls(org_id UUID)    → route.ts:1220
--   2. add_call_duration(org_id, seconds)       → route.ts:298
-- match_tenant wurde entfernt (v15-rpc-sync, 2026-05-13)
-- ============================================================

-- ── STEP 1: Billing-Spalten sicherstellen (aus v10) ───────────
-- Idempotent: ADD COLUMN IF NOT EXISTS schlägt nicht fehl,
-- wenn die Spalte bereits existiert.

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'starter'
    CHECK (plan_tier IN ('starter', 'pro', 'enterprise', 'free'));

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS call_limit INTEGER DEFAULT 100;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS current_month_calls INTEGER NOT NULL DEFAULT 0;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMPTZ
    DEFAULT date_trunc('month', NOW());

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS setup_fee_paid BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS overage_per_call NUMERIC(10, 2) NOT NULL DEFAULT 0.80;

-- ── STEP 2: Duration-Spalten sicherstellen (aus v11) ──────────

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS duration_limit_minutes INTEGER;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS current_month_duration_seconds INTEGER NOT NULL DEFAULT 0;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS total_duration_seconds_all_time BIGINT NOT NULL DEFAULT 0;

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- ── STEP 3: RPC 1 — increment_monthly_calls ───────────────────
-- Aufgerufen in: route.ts:1220
-- Zweck: Atomares Inkrementieren des monatlichen Call-Zählers
-- pro Organisation. Verhindert Read-then-Write-Race-Conditions.

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

-- ── STEP 4: RPC 2 — add_call_duration ─────────────────────────
-- Aufgerufen in: route.ts:298 (call-ended handler)
-- Zweck: Summiert Gesprächssekunden auf organizations auf.
-- Beide Felder werden atomar aktualisiert.

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

-- ── STEP 5: Monthly reset (Cron-fähig) ────────────────────────
-- Registrierung im Supabase Cron (einmalig in SQL Editor ausführen):
--
--   SELECT cron.schedule(
--     'reset-monthly-call-counts',
--     '0 0 1 * *',
--     $$ SELECT reset_monthly_call_counts(); $$
--   );

CREATE OR REPLACE FUNCTION reset_monthly_call_counts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE organizations
  SET current_month_calls                = 0,
      current_month_duration_seconds     = 0,
      billing_cycle_start                = date_trunc('month', NOW()),
      updated_at                         = NOW();
$$;

-- ── STEP 6: Billing-View (aktualisiert, idempotent) ───────────

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
  ROUND(current_month_duration_seconds / 60.0, 2) AS current_month_minutes,
  total_duration_seconds_all_time,
  overage_per_call,
  CASE
    WHEN call_limit IS NULL THEN false
    ELSE current_month_calls > call_limit
  END AS is_calls_over_limit,
  CASE
    WHEN duration_limit_minutes IS NULL THEN false
    ELSE (current_month_duration_seconds / 60.0) > duration_limit_minutes
  END AS is_duration_over_limit,
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

-- ── STEP 7: Verifikations-Query ────────────────────────────────
-- Nach Ausführung: Diese Query sollte alle RPCs und Spalten
-- bestätigen. Führe sie separat im SQL Editor aus.
--
-- SELECT
--   routine_name,
--   routine_type
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
--   AND routine_name IN (
--     'increment_monthly_calls',
--     'add_call_duration',
--     'reset_monthly_call_counts'
--   )
-- ORDER BY routine_name;
--
-- Erwartetes Ergebnis:
--   add_call_duration        | FUNCTION
--   increment_monthly_calls  | FUNCTION
--   reset_monthly_call_counts| FUNCTION

-- ── DONE ──────────────────────────────────────────────────────
