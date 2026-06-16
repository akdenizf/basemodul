/**
 * Phone number normalization — single source of truth for all Vapi routes.
 *
 * Problem this solves:
 *   Vapi delivers +491701234567, callers say "0170 123 4567", DB stores E.164.
 *   All three must resolve to the same ilike search pattern.
 *
 * Strategy: strip every non-digit, compare the last 10 digits.
 *   +491701234567  → 491701234567 → last10 → 1701234567
 *    01701234567   → 01701234567  → last10 → 1701234567
 *      1701234567  → 1701234567   → last10 → 1701234567
 *
 * Limitation: two numbers whose last 10 digits collide would both match.
 * In practice this is negligible for German mobile/landline numbers at tenant scale.
 */

/** Strip every non-digit character. Handles null/undefined safely. */
export function digitsOnly(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Return the last 10 digits of the stripped phone number.
 * This normalizes +49, 0049, and 0 prefixes into the same suffix.
 */
export function getLast10(phone: string | null | undefined): string {
  return digitsOnly(phone).slice(-10);
}

/**
 * Return the Supabase ilike pattern to match any stored format:
 *   '%1701234567'  matches '+491701234567', '01701234567', '1701234567'
 */
export function phoneIlikePattern(phone: string | null | undefined): string {
  return `%${getLast10(phone)}`;
}

/**
 * Minimum digit count to treat a phone as searchable.
 * Prevents accidental broad matches on very short inputs.
 */
export const MIN_PHONE_DIGITS = 8;

/** True if the phone string has enough digits to be worth querying. */
export function isSearchablePhone(phone: string | null | undefined): boolean {
  return getLast10(phone).length >= MIN_PHONE_DIGITS;
}

/**
 * Best-effort normalization to E.164 for German mobile/landline numbers.
 * Handles all common input formats before DB lookup:
 *   +491701234567  → +491701234567  (already E.164 — pass through)
 *   00491701234567 → +491701234567  (0049 prefix)
 *   01701234567    → +491701234567  (leading 0, German local)
 *   1701234567     → +491701234567  (10-digit without prefix)
 *
 * The DB query still uses getLast10/phoneIlikePattern as the reliable fallback;
 * this function is used as a preprocessing step for display and logging.
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  const digits = digitsOnly(phone);
  if (!digits) return '';

  if (digits.startsWith('0049') && digits.length >= 13) return '+' + digits.slice(2);
  if (digits.startsWith('49') && digits.length >= 11) return '+' + digits;
  if (digits.startsWith('0') && digits.length >= 10) return '+49' + digits.slice(1);
  if (digits.length === 10) return '+49' + digits;

  // Unknown format — return stripped digits so downstream getLast10 still works
  return digits;
}
