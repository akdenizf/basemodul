-- CALLFOLIO MULTI-TENANT EMAIL NOTIFICATION SETUP
-- Add organization-specific notification email functionality

-- STEP 1: Add notification_email column to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS notification_email TEXT;

-- STEP 2: Add index for performance
CREATE INDEX IF NOT EXISTS idx_tenants_notification_email ON tenants(notification_email) WHERE notification_email IS NOT NULL;

-- STEP 3: Add comment for documentation
COMMENT ON COLUMN tenants.notification_email IS 'E-Mail-Adresse für Ticket-Benachrichtigungen der Organisation';

-- STEP 4: Update the helper function to include notification_email
CREATE OR REPLACE FUNCTION get_user_organization(user_uuid UUID)
RETURNS TABLE(
  organization_id UUID,
  organization_name TEXT,
  tenant_id_string TEXT,
  vapi_phone_id TEXT,
  notification_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as organization_id,
    t.name as organization_name,
    t.tenant_id as tenant_id_string,
    t.vapi_phone_id,
    t.notification_email
  FROM profiles p
  JOIN tenants t ON p.tenant_id = t.id
  WHERE p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SUCCESS MESSAGE
SELECT 'NOTIFICATION EMAIL SETUP COMPLETE!' as status,
       'Organizations can now set custom notification emails for tickets.' as message;