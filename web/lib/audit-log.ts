import { getSupabaseAdmin } from "@/lib/supabase/admin";

// V5.0 Audit Log Helper Functions
// Provides centralized logging for all ticket activities

export interface ActivityLogEntry {
  ticket_id: string;
  admin_email: string;
  activity_type: 'created' | 'updated' | 'email_sent' | 'status_changed' | 'assigned' | 'reviewed' | 'manual_action' | 'photo_requested' | 'attachment_uploaded' | 'contractor_notified' | 'system_error';
  description: string;
  old_value?: any;
  new_value?: any;
  metadata?: Record<string, any>;
}

export interface TicketActivity {
  id: string;
  ticket_id: string;
  admin_email: string | null;
  activity_type: string;
  description: string;
  old_value?: any;
  new_value?: any;
  metadata?: Record<string, any>;
  created_at: string;
}

// Use the singleton admin client from the consolidated module
function getSupabaseClient() {
  return getSupabaseAdmin();
}

/**
 * Log an activity for a ticket
 * @param entry Activity log entry details
 */
export async function logActivity(entry: ActivityLogEntry): Promise<void> {
  try {
    const { error } = await getSupabaseClient()
      .from('ticket_activities')
      .insert({
        ticket_id: entry.ticket_id,
        admin_email: entry.admin_email,
        activity_type: entry.activity_type,
        description: entry.description,
        old_value: entry.old_value || null,
        new_value: entry.new_value || null,
        metadata: entry.metadata || {}
      } as any);

    if (error) {
      console.error('Failed to log activity:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging failures shouldn't break the main flow
  }
}

/**
 * Get all activities for a specific ticket
 * @param ticketId Ticket UUID
 * @returns Array of ticket activities, sorted by most recent first
 */
export async function getTicketActivities(ticketId: string): Promise<TicketActivity[]> {
  try {
    const { data, error } = await getSupabaseClient()
      .from('ticket_activities')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch ticket activities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching ticket activities:', error);
    return [];
  }
}

/**
 * Get activities for multiple tickets (for dashboard overview)
 * @param ticketIds Array of ticket UUIDs
 * @returns Map of ticket ID to activities
 */
export async function getBulkTicketActivities(ticketIds: string[]): Promise<Map<string, TicketActivity[]>> {
  try {
    const { data, error } = await getSupabaseClient()
      .from('ticket_activities')
      .select('*')
      .in('ticket_id', ticketIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch bulk ticket activities:', error);
      return new Map();
    }

    // Group activities by ticket_id
    const activitiesMap = new Map<string, TicketActivity[]>();
    (data as any[] || []).forEach(activity => {
      if (!activitiesMap.has(activity.ticket_id)) {
        activitiesMap.set(activity.ticket_id, []);
      }
      activitiesMap.get(activity.ticket_id)!.push(activity);
    });

    return activitiesMap;
  } catch (error) {
    console.error('Error fetching bulk ticket activities:', error);
    return new Map();
  }
}

/**
 * Log email sent activity
 * @param ticketId Ticket UUID
 * @param adminEmail Admin who sent the email
 * @param emailData Email details (recipient, subject, etc.)
 */
export async function logEmailSent(
  ticketId: string,
  adminEmail: string,
  emailData: {
    recipient: string;
    subject: string;
    template_type?: string;
    contractor_name?: string;
    success: boolean;
  }
): Promise<void> {
  await logActivity({
    ticket_id: ticketId,
    admin_email: adminEmail,
    activity_type: 'email_sent',
    description: emailData.success
      ? `E-Mail erfolgreich gesendet an ${emailData.recipient}`
      : `E-Mail-Versand fehlgeschlagen an ${emailData.recipient}`,
    new_value: {
      recipient: emailData.recipient,
      subject: emailData.subject,
      success: emailData.success
    },
    metadata: {
      template_type: emailData.template_type || 'manual',
      contractor_name: emailData.contractor_name,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log status change activity
 * @param ticketId Ticket UUID
 * @param adminEmail Admin who changed the status
 * @param oldStatus Previous status
 * @param newStatus New status
 * @param reason Optional reason for the change
 */
export const STATUS_LABELS: Record<string, string> = {
  NEW: 'Neu',
  IN_PROGRESS: 'In Bearbeitung',
  RESOLVED: 'Abgeschlossen',
  CLOSED: 'Geschlossen',
};

const labelOf = (s: string) => STATUS_LABELS[s] ?? s;

export async function logStatusChange(
  ticketId: string,
  adminEmail: string,
  oldStatus: string,
  newStatus: string,
  reason?: string
): Promise<void> {
  await logActivity({
    ticket_id: ticketId,
    admin_email: adminEmail,
    activity_type: 'status_changed',
    description: `Status von „${labelOf(oldStatus)}" auf „${labelOf(newStatus)}" gesetzt${reason ? ` — ${reason}` : ''}`,
    old_value: { status: oldStatus },
    new_value: { status: newStatus },
    metadata: {
      reason: reason || null,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log tenant assignment activity
 * @param ticketId Ticket UUID
 * @param adminEmail Admin who made the assignment
 * @param tenantData Tenant information
 */
export async function logTenantAssignment(
  ticketId: string,
  adminEmail: string,
  tenantData: {
    tenant_id?: string;
    tenant_name: string;
    confidence?: number;
    manual: boolean;
  }
): Promise<void> {
  await logActivity({
    ticket_id: ticketId,
    admin_email: adminEmail,
    activity_type: 'assigned',
    description: tenantData.manual
      ? `Mieter manuell zugeordnet: ${tenantData.tenant_name}`
      : `Mieter automatisch zugeordnet: ${tenantData.tenant_name} (${Math.round((tenantData.confidence || 0) * 100)}%)`,
    new_value: {
      tenant_id: tenantData.tenant_id,
      tenant_name: tenantData.tenant_name,
      confidence: tenantData.confidence
    },
    metadata: {
      manual_assignment: tenantData.manual,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log manual review activity
 * @param ticketId Ticket UUID
 * @param adminEmail Admin who performed the review
 * @param reviewData Review details
 */
export async function logManualReview(
  ticketId: string,
  adminEmail: string,
  reviewData: {
    action: 'approved' | 'rejected' | 'needs_more_info';
    notes?: string;
  }
): Promise<void> {
  await logActivity({
    ticket_id: ticketId,
    admin_email: adminEmail,
    activity_type: 'reviewed',
    description: `Manuelle Überprüfung: ${reviewData.action}${reviewData.notes ? ` - ${reviewData.notes}` : ''}`,
    new_value: {
      review_action: reviewData.action,
      notes: reviewData.notes
    },
    metadata: {
      review_timestamp: new Date().toISOString()
    }
  });
}

/**
 * Get current admin email from localStorage (client-side) or session
 * Fallback to environment variable for server-side operations
 */
export function getCurrentAdminEmail(): string {
  // Client-side: try to get from localStorage
  if (typeof window !== 'undefined') {
    const storedEmail = localStorage.getItem('admin_email');
    if (storedEmail) return storedEmail;
  }

  // Server-side fallback
  return process.env.ADMIN_EMAIL || 'admin@example.com';
}

/**
 * Format activity description for display
 * @param activity Ticket activity
 * @returns Formatted description with context
 */
export function formatActivityDescription(activity: TicketActivity): string {
  const baseDescription = activity.description;

  // Add admin context if not system-generated
  if (activity.admin_email && activity.admin_email !== 'system@callfolio.io') {
    const adminName = activity.admin_email.split('@')[0];
    return `${baseDescription} (von ${adminName})`;
  }

  return baseDescription;
}

/**
 * Get activity type icon for UI display
 * @param activityType Activity type
 * @returns Icon name or emoji
 */
export function getActivityIcon(activityType: string): string {
  const icons: Record<string, string> = {
    'created': '🎫',
    'updated': '✏️',
    'email_sent': '📧',
    'status_changed': '🔄',
    'assigned': '👤',
    'reviewed': '👁️',
    'manual_action': '⚡',
    'contractor_notified': '✅',
    'system_error': '⚠️'
  };

  return icons[activityType] || '📝';
}

/**
 * Log contractor notification activity (email sent to contractor)
 * @param ticketId Ticket UUID
 * @param adminEmail Admin who sent the notification
 * @param contractorData Contractor details
 */
export async function logContractorNotified(
  ticketId: string,
  adminEmail: string,
  contractorData: {
    contractor_id: string;
    contractor_name: string;
    contractor_email: string;
    success: boolean;
  }
): Promise<void> {
  await logActivity({
    ticket_id: ticketId,
    admin_email: adminEmail,
    activity_type: 'contractor_notified',
    description: contractorData.success
      ? `✅ Auftrag versendet an ${contractorData.contractor_name}`
      : `❌ Auftragsversand fehlgeschlagen an ${contractorData.contractor_name}`,
    new_value: {
      contractor_id: contractorData.contractor_id,
      contractor_name: contractorData.contractor_name,
      contractor_email: contractorData.contractor_email,
      success: contractorData.success
    },
    metadata: {
      notification_type: 'contractor_order',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Log system error (e.g. SMS failure, Twilio error)
 * Used by webhook when SMS fails so the admin sees why no photo request arrived.
 * @param ticketId Ticket UUID
 * @param errorData Error details
 */
export async function logSystemError(
  ticketId: string,
  errorData: {
    context: string;
    error: string;
    payload?: Record<string, unknown>;
  }
): Promise<void> {
  await logActivity({
    ticket_id: ticketId,
    admin_email: 'system@callfolio.io',
    activity_type: 'system_error',
    description: `⚠️ ${errorData.context}: ${errorData.error}`,
    metadata: {
      ...errorData.payload,
      error: errorData.error,
      context: errorData.context,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Get relative time string for activity timestamps
 * @param timestamp ISO timestamp string
 * @returns Human-readable relative time
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now.getTime() - activityTime.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'gerade eben';
  if (diffMinutes < 60) return `vor ${diffMinutes} Min`;
  if (diffHours < 24) return `vor ${diffHours} Std`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

  return activityTime.toLocaleDateString('de-DE');
}

// ============================================================
// V5.5 – Global History (Organisation-wide)
// ============================================================

export interface TicketActivityWithContext extends TicketActivity {
  ticket_code: string | null;
  issue_summary: string | null;
  has_attachments: boolean;
}

export interface GetAllActivitiesOptions {
  type?: string;       // activity_type filter (comma-separated for multi)
  search?: string;     // ilike search on description / admin_email / ticket_code
  limit?: number;      // default 100
}

/**
 * Fetch the most recent activities across all tickets for a given organisation.
 * Joins through tickets to enforce org scoping, and left-joins ticket_attachments
 * to flag visual context.
 */
export async function getAllActivities(
  organizationId: string,
  options: GetAllActivitiesOptions = {}
): Promise<TicketActivityWithContext[]> {
  const { type, search, limit = 100 } = options;

  try {
    const supabase = getSupabaseClient();

    // Step 1: Get ticket IDs + metadata for this organisation
    let ticketQuery = supabase
      .from('tickets')
      .select('id, ticket_code, issue_summary')
      .eq('organization_id', organizationId);

    // If searching by ticket_code, pre-filter here
    if (search) {
      ticketQuery = ticketQuery.or(`ticket_code.ilike.%${search}%,issue_summary.ilike.%${search}%`);
    }

    const { data: tickets, error: ticketsError } = await ticketQuery;

    if (ticketsError) {
      console.error('[Audit] Failed to fetch tickets for history:', ticketsError);
      return [];
    }

    if (!tickets || tickets.length === 0) {
      // If search narrowed to zero tickets, also check activities by admin_email / description
      if (!search) return [];
      // Fall through – we'll query activities without ticket_id filter below
    }

    const ticketIds = (tickets || []).map((t: any) => t.id);
    const ticketMap = new Map<string, { ticket_code: string | null; issue_summary: string | null }>();
    (tickets || []).forEach((t: any) => {
      ticketMap.set(t.id, { ticket_code: t.ticket_code, issue_summary: t.issue_summary });
    });

    // Step 2: Get activities for those tickets
    let activityQuery = supabase
      .from('ticket_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (ticketIds.length > 0) {
      activityQuery = activityQuery.in('ticket_id', ticketIds);
    }

    // Filter by activity_type(s)
    if (type) {
      const types = type.split(',').map(t => t.trim());
      if (types.length === 1) {
        activityQuery = activityQuery.eq('activity_type', types[0]);
      } else {
        activityQuery = activityQuery.in('activity_type', types);
      }
    }

    // Text search on description / admin_email
    if (search) {
      activityQuery = activityQuery.or(`description.ilike.%${search}%,admin_email.ilike.%${search}%`);
    }

    const { data: activities, error: activitiesError } = await activityQuery;

    if (activitiesError) {
      console.error('[Audit] Failed to fetch activities for history:', activitiesError);
      return [];
    }

    if (!activities || activities.length === 0) return [];

    // Step 3: Check which tickets have attachments
    const relevantTicketIds = Array.from(new Set((activities as any[]).map(a => a.ticket_id)));
    const { data: attachments } = await supabase
      .from('ticket_attachments')
      .select('ticket_id')
      .in('ticket_id', relevantTicketIds);

    const ticketsWithAttachments = new Set((attachments || []).map((a: any) => a.ticket_id));

    // Step 4: Merge everything
    return (activities as any[]).map(a => {
      const meta = ticketMap.get(a.ticket_id);
      return {
        ...a,
        ticket_code: meta?.ticket_code ?? null,
        issue_summary: meta?.issue_summary ?? null,
        has_attachments: ticketsWithAttachments.has(a.ticket_id),
      } as TicketActivityWithContext;
    });
  } catch (error) {
    console.error('[Audit] Error in getAllActivities:', error);
    return [];
  }
}