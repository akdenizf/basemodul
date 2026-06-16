# SQL Notes — Database Architecture (V5.1)

**V5.1 SCOPE CHECK**: Only bugfixes, stabilization, and pilot adjustments allowed. No new features or endpoints.

## Extensions & Core
- **`uuid-ossp`**: Primary key generation
- **`pg_trgm`**: Trigram similarity for fuzzy matching

## Security (RLS)
- **Tenants**: Row Level Security enabled. Admin access via service role.
- **Tickets**: Row Level Security enabled. Admin access via service role.
- **Ticket Activities**: Row Level Security enabled. Admin access via service role.

## V5.0 Schema Enhancements
- **`tickets.match_type`**: Simplified to `MATCH | REVIEW | UNKNOWN` (was 4 types)
- **`tickets.final_caller_name`**: Corrected name after fuzzy matching
- **`tickets.ticket_json`**: Made nullable for DSGVO compliance
- **`ticket_activities`**: New audit log table with full activity tracking

## Logic (Triggers & Functions)
- **`match_tenant`**: ENHANCED RPC with 40/60 name/address weighting (replaces `fuzzy_tenant_search`)
- **`generate_ticket_code`**: Trigger before insert for 6-digit verification codes
- **`update_updated_at_column`**: Automated timestamp management
- **`log_ticket_creation`**: NEW - Auto-logs ticket creation to audit table
- **`log_ticket_update`**: NEW - Auto-logs status changes and updates

## Indexes
- **GIN Indexes**: name and address fields in `tenants` for fuzzy performance
- **Phone Indexes**: Simplified `(phone)` for V5.0 phone matching
- **Conditional Indexes**: `requires_manual_review = true` for dashboard filtering
- **Audit Indexes**: `(ticket_id, created_at DESC)` and `(activity_type, created_at DESC)` for timeline performance
- **Match Type Index**: `(match_type, created_at DESC)` for V5.0 filtering
