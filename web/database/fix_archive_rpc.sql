-- ============================================================
-- CRITICAL FIX: PostgREST schema cache ignores is_archived
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Step 1: Force PostgREST to reload its schema cache
-- This tells PostgREST about the is_archived column
NOTIFY pgrst, 'reload schema';

-- Step 2: Create an RPC function that bypasses PostgREST's REST layer
-- This uses direct SQL, so it's immune to schema cache issues
CREATE OR REPLACE FUNCTION set_ticket_archived(
  p_ticket_id UUID,
  p_is_archived BOOLEAN,
  p_new_status TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  UPDATE tickets
  SET
    is_archived = p_is_archived,
    status = COALESCE(p_new_status::ticket_status, status),
    updated_at = NOW()
  WHERE id = p_ticket_id;

  -- Return the actual row from the database to verify
  SELECT jsonb_build_object(
    'id', id,
    'is_archived', is_archived,
    'status', status
  ) INTO result
  FROM tickets WHERE id = p_ticket_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Grant access to the function
GRANT EXECUTE ON FUNCTION set_ticket_archived TO service_role;
GRANT EXECUTE ON FUNCTION set_ticket_archived TO authenticated;

-- Verify: test the function (optional)
-- SELECT set_ticket_archived('YOUR-TICKET-ID-HERE', true, 'CLOSED');

SELECT 'RPC function created successfully! Archive should now work.' as status;
