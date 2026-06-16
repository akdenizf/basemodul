/**
 * Shared constants for all Vapi API routes.
 * Single source of truth — avoids duplication across webhook, get-tickets, add-ticket-note.
 */

/** DB enum: ticket_status ('NEW','IN_PROGRESS','RESOLVED','CLOSED') */
export const ACTIVE_STATUSES = ["NEW", "IN_PROGRESS"] as const;

/** Fields selected for ticket lookup responses. */
export const TICKET_SELECT = "id, issue_summary, status, category" as const;

/** Timezone for German locale timestamps in ticket notes. */
export const DE_TIMEZONE = "Europe/Berlin" as const;

/**
 * Build a German-locale timestamp string for ticket note headers.
 * Uses Europe/Berlin so timestamps are correct regardless of server location.
 */
export function deTimestamp(): string {
  return new Date().toLocaleString("de-DE", { timeZone: DE_TIMEZONE });
}
