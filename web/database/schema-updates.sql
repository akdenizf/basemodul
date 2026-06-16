-- Database Schema Updates for Duplicate Ticket Prevention
-- Run these commands in your Supabase SQL Editor

-- Add updated_at column to track ticket updates
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add parent_ticket_id for potential ticket relationships
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS parent_ticket_id UUID REFERENCES tickets(id);

-- Create index for performance on phone number and status lookups
-- This is crucial for the check_existing_ticket API performance
CREATE INDEX IF NOT EXISTS idx_tickets_phone_status 
ON tickets(caller_phone, status) 
WHERE status IN ('NEW', 'IN_PROGRESS');

-- Create index for updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at 
ON tickets(updated_at DESC);

-- Create index for tenant_id and created_at (existing performance optimization)
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_created 
ON tickets(tenant_id, created_at DESC);

-- Update existing tickets to have updated_at = created_at if null
UPDATE tickets 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Create a function to automatically update updated_at on ticket changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN tickets.updated_at IS 'Timestamp of last ticket update';
COMMENT ON COLUMN tickets.parent_ticket_id IS 'Reference to parent ticket for related tickets';
COMMENT ON INDEX idx_tickets_phone_status IS 'Performance index for checking existing open tickets by phone';