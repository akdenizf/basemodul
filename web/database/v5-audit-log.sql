-- V5.0 Audit Log System for Callfolio
-- Creates ticket_activities table for comprehensive activity tracking

-- Create ticket_activities table
CREATE TABLE IF NOT EXISTS ticket_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  admin_email TEXT,
  activity_type TEXT NOT NULL, -- 'created', 'updated', 'email_sent', 'status_changed', 'assigned', 'reviewed'
  description TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ticket_activities_ticket_id ON ticket_activities(ticket_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_admin ON ticket_activities(admin_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_type ON ticket_activities(activity_type, created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE ticket_activities IS 'V5.0 Audit log for tracking all ticket-related activities and admin actions';
COMMENT ON COLUMN ticket_activities.activity_type IS 'Type of activity: created, updated, email_sent, status_changed, assigned, reviewed';
COMMENT ON COLUMN ticket_activities.description IS 'Human-readable description of the activity';
COMMENT ON COLUMN ticket_activities.old_value IS 'Previous value before change (for updates)';
COMMENT ON COLUMN ticket_activities.new_value IS 'New value after change (for updates)';
COMMENT ON COLUMN ticket_activities.metadata IS 'Additional context data (email recipients, etc.)';

-- Create function to automatically log ticket creation
CREATE OR REPLACE FUNCTION log_ticket_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ticket_activities (
    ticket_id,
    admin_email,
    activity_type,
    description,
    new_value,
    metadata
  ) VALUES (
    NEW.id,
    'system@callfolio.io', -- System-generated tickets
    'created',
    'Ticket automatisch erstellt über Vapi-Anruf',
    jsonb_build_object(
      'caller_name', NEW.caller_name,
      'caller_phone', NEW.caller_phone,
      'issue_summary', NEW.issue_summary,
      'urgency', NEW.urgency,
      'category', NEW.category
    ),
    jsonb_build_object(
      'call_id', NEW.call_id,
      'match_type', NEW.match_type,
      'match_confidence', NEW.match_confidence
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic ticket creation logging
DROP TRIGGER IF EXISTS trigger_log_ticket_creation ON tickets;
CREATE TRIGGER trigger_log_ticket_creation
  AFTER INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_ticket_creation();

-- Create function to log ticket updates
CREATE OR REPLACE FUNCTION log_ticket_update()
RETURNS TRIGGER AS $$
DECLARE
  changes_detected BOOLEAN := FALSE;
  change_description TEXT := '';
BEGIN
  -- Check for status changes
  IF OLD.status != NEW.status THEN
    changes_detected := TRUE;
    change_description := change_description || 'Status: ' || OLD.status || ' → ' || NEW.status || '; ';
  END IF;
  
  -- Check for urgency changes
  IF OLD.urgency != NEW.urgency THEN
    changes_detected := TRUE;
    change_description := change_description || 'Dringlichkeit: ' || OLD.urgency || ' → ' || NEW.urgency || '; ';
  END IF;
  
  -- Check for assignment changes (caller_name as proxy for tenant assignment)
  IF COALESCE(OLD.caller_name, '') != COALESCE(NEW.caller_name, '') THEN
    changes_detected := TRUE;
    change_description := change_description || 'Mieter zugeordnet: ' || COALESCE(NEW.caller_name, 'Unbekannt') || '; ';
  END IF;
  
  -- Log the changes if any were detected
  IF changes_detected THEN
    INSERT INTO ticket_activities (
      ticket_id,
      admin_email,
      activity_type,
      description,
      old_value,
      new_value
    ) VALUES (
      NEW.id,
      'system@callfolio.io', -- Will be overridden by manual admin actions
      'updated',
      'Ticket aktualisiert: ' || TRIM(TRAILING '; ' FROM change_description),
      jsonb_build_object(
        'status', OLD.status,
        'urgency', OLD.urgency,
        'caller_name', OLD.caller_name
      ),
      jsonb_build_object(
        'status', NEW.status,
        'urgency', NEW.urgency,
        'caller_name', NEW.caller_name
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic ticket update logging
DROP TRIGGER IF EXISTS trigger_log_ticket_update ON tickets;
CREATE TRIGGER trigger_log_ticket_update
  AFTER UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_ticket_update();

-- Insert some sample activities for existing tickets (if any)
-- This helps with testing and provides initial data
DO $$
DECLARE
  ticket_record RECORD;
BEGIN
  FOR ticket_record IN SELECT id, caller_name, created_at FROM tickets LIMIT 5 LOOP
    INSERT INTO ticket_activities (
      ticket_id,
      admin_email,
      activity_type,
      description,
      metadata
    ) VALUES (
      ticket_record.id,
      'system@callfolio.io',
      'created',
      'Historisches Ticket (migriert zu V5.0)',
      jsonb_build_object(
        'migration', true,
        'original_created_at', ticket_record.created_at
      )
    );
  END LOOP;
END $$;