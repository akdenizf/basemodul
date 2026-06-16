export type TicketStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketUrgency = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "EMERGENCY";
export type TicketCategory = "PLUMBING" | "HEATING" | "ELECTRICAL" | "BUILDING" | "ADMIN" | "COMMERCIAL" | "BILLING" | "UTILITIES" | "NOISE_COMPLAINT" | "OTHER";
export type TicketSentiment = "CALM" | "STRESSED" | "ANGRY" | "UNKNOWN";

// V4.0/V5.0 Match Types for 3-Tier Logic + Manual Resolution
// MATCH: Phone exact or high confidence fuzzy match (>= 0.7)
// REVIEW: Medium confidence fuzzy match (0.4-0.7) - requires manual review
// UNKNOWN: No match or low confidence (< 0.4)
// MANUAL_MATCH: Confirmed or assigned by a human operator via the dashboard
export type MatchType = 'MATCH' | 'REVIEW' | 'UNKNOWN' | 'MANUAL_MATCH';

export interface Tenant {
  id: string;
  created_at?: string;
  updated_at?: string;
  tenant_id: string; // Verwaltungs-ID (z.B. "test-verwaltung")
  name: string;
  first_name?: string | null;
  last_name?: string | null;
  address: string;
  // Discrete address fields (SoT — see migration v19). `address` is the
  // denormalized concatenation kept for legacy reads.
  street?: string | null;
  house_number?: string | null;
  zip?: string | null;
  city?: string | null;
  phone?: string | null; // Optional in database
  unit: string;
  email?: string | null;
  notes?: string | null;
}

export interface Ticket {
  id: string;
  created_at: string;
  updated_at?: string;
  tenant_id: string;
  call_id: string;
  ticket_id: string | null;
  ticket_code?: string | null;

  status: TicketStatus;
  urgency: TicketUrgency;
  category: TicketCategory;
  sentiment: TicketSentiment;

  caller_name: string | null;
  caller_phone: string | null;

  address: string | null;
  unit: string | null;

  issue_summary: string | null;
  issue_details: string | null;

  escalation_is_emergency: boolean;
  escalation_reason: string | null;

  vapi_cost: number | null;
  ticket_json?: any; // Made optional and nullable for GDPR compliance
  parent_ticket_id?: string | null;
  duplicate_of?: string | null;

  // V4.0 Fuzzy Matching Fields (aligned with database schema)
  raw_caller_name?: string | null;
  raw_caller_address?: string | null;
  final_caller_name?: string | null; // Added missing field
  match_type?: MatchType;
  match_confidence?: number; // Range: 0.00-1.00 (database constraint)
  requires_manual_review?: boolean;
  matched_tenant_id?: string | null; // Aligned with database FK
  alternatives?: Tenant[];
  is_archived?: boolean; // v5.3: Archive support
  contractor_id?: string | null; // v8: Assigned contractor
  follow_up_count?: number;
  attachment_count?: number; // v8: Number of attached photos
  appointment_date?: string | null; // v12: Handwerker-Termin
  contractor_confirmed_at?: string | null; // v12: Zeitpunkt der Auftragsbestätigung
}

export interface CheckExistingTicketResponse {
  has_existing: boolean;
  verified: boolean;
  match_type: 'none' | 'phone_only' | 'code_verified' | 'address_verified';
  ticket?: {
    ticket_id: string;
    ticket_code: string;
    summary: string;
    created_at: string;
    urgency: string;
    status: string;
    tenant_match_type?: string;
    match_confidence?: number;
  };
}