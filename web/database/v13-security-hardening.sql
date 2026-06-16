-- ============================================================
-- CALLFOLIO v13 — Security Hardening
-- Fixes critical Supabase Advisor warnings:
--   1. RLS disabled on public.emergency_keywords
--   2. SECURITY DEFINER views: ticket_details, organization_billing_status
-- ============================================================
-- Run in: Supabase Dashboard → SQL Editor
-- Impact: Zero — all API paths use getSupabaseAdmin() (service role),
--         which bypasses RLS entirely. No functionality changes.
-- ============================================================


-- ── 1. emergency_keywords: Enable RLS + authenticated read policy ──

ALTER TABLE public.emergency_keywords ENABLE ROW LEVEL SECURITY;

-- Allow any logged-in user to read keywords (needed for detect_emergency_keywords fn)
-- The service role used by our API always bypasses this policy.
CREATE POLICY "authenticated_read_emergency_keywords"
  ON public.emergency_keywords
  FOR SELECT
  TO authenticated
  USING (true);


-- ── 2. ticket_details: Switch from SECURITY DEFINER to SECURITY INVOKER ──

ALTER VIEW public.ticket_details SET (security_invoker = true);


-- ── 3. organization_billing_status: Switch from SECURITY DEFINER to SECURITY INVOKER ──

ALTER VIEW public.organization_billing_status SET (security_invoker = true);


-- ── Verification ──
-- After running, confirm in Supabase Dashboard → Advisors → Security that:
--   • public.emergency_keywords — no longer flagged
--   • public.ticket_details — no longer flagged
--   • public.organization_billing_status — no longer flagged
