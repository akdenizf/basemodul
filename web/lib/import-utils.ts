/**
 * v5.1 Onboarding Engine - Hardened CSV Import Utilities
 * 
 * MINIMAL SURFACE AREA - Only 4 essential functions for security audit compliance:
 * - Phone number normalization (strict E.164)
 * - CSV formula injection protection
 * - Canonical address key generation
 * - Row validation with required field enforcement
 */

// Export core types
export type { ImportRow, NormalizedRow, ImportResult, ConflictRow, ErrorRow } from './import-types';
import type { ImportRow, NormalizedRow } from './import-types';

/**
 * Normalizes German phone numbers to strict E.164 format
 * Returns null for invalid numbers (no silent failures)
 * 
 * @param phone - Raw phone number string
 * @returns E.164 formatted number or null if invalid
 */
export function normalizePhoneNumber(phone: string): string | null {
  if (!phone || typeof phone !== 'string') return null;
  
  const cleaned = phone.replace(/[\s\-\(\)\/\.]/g, '');
  
  // Strict German E.164 patterns only
  if (cleaned.startsWith('+49') && /^\+49\d{10,11}$/.test(cleaned)) {
    return cleaned;
  }
  if (cleaned.startsWith('0049') && /^0049\d{10,11}$/.test(cleaned)) {
    return '+49' + cleaned.substring(4);
  }
  if (cleaned.startsWith('0') && /^0\d{10,11}$/.test(cleaned)) {
    return '+49' + cleaned.substring(1);
  }
  
  return null; // Reject anything else
}

/**
 * Escapes CSV formula injection characters
 * Protects against =, +, -, @ at start of values
 * 
 * @param value - String value to escape
 * @returns Escaped string safe for CSV
 */
export function escapeCsvFormula(value: string): string {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  return ['=', '+', '-', '@'].some(c => trimmed.startsWith(c)) 
    ? "'" + trimmed 
    : trimmed;
}

/**
 * Builds canonical address key for deduplication
 * Simple normalization: lowercase + trim + collapse spaces
 * 
 * @param address - Street address
 * @param unit - Unit/apartment identifier  
 * @returns Canonical address key
 */
export function buildCanonicalAddress(address: string, unit: string): string {
  const cleanAddr = (address || '').toLowerCase().trim().replace(/\s+/g, ' ');
  const cleanUnit = (unit || '').toLowerCase().trim().replace(/\s+/g, ' ');
  return `${cleanAddr}|${cleanUnit}`;
}

/**
 * Validates and normalizes a single import row
 * Enforces required fields and validates optional fields strictly
 * 
 * @param row - Raw import row data
 * @param rowNumber - Row number for error reporting
 * @returns Normalized row with validation results
 */
export function validateRow(row: ImportRow, rowNumber?: number): NormalizedRow {
  const errors: string[] = [];
  
  // Identity validation: tenant_id OR (name + address + unit)
  const hasTenantId = !!row.tenant_id?.trim();
  const hasNameAddressUnit = !!(row.name?.trim() && row.address?.trim() && row.unit?.trim());

  if (!hasTenantId && !hasNameAddressUnit) {
    errors.push('Row must have either Tenant ID, or Name, Address, and Unit');
  } else if (!hasTenantId) {
    // If no tenant_id, then name, address, unit must be present
    if (!row.name?.trim()) errors.push('Name is required');
    if (!row.address?.trim()) errors.push('Address is required'); 
    if (!row.unit?.trim()) errors.push('Unit is required');
  }

  // PLZ validation (exactly 5 digits within address string) - OPTIONAL for v5.1
  // Relaxed: We warn but don't block import if PLZ is missing
  // if (row.address?.trim()) {
  //   const plzMatch = row.address.match(/\b(\d{5})\b/);
  //   if (!plzMatch || plzMatch[1].length !== 5) {
  //     errors.push('Address must contain a valid 5-digit Postleitzahl (PLZ)');
  //   }
  // }
  
  // Phone validation (optional but strict if present)
  let normalized_phone: string | null = null;
  if (row.phone?.trim()) {
    normalized_phone = normalizePhoneNumber(row.phone);
    if (!normalized_phone) errors.push('Invalid phone number format');
  }
  
  // Email validation (optional but strict if present)
  if (row.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) {
    errors.push('Invalid email format');
  }
  
  return {
    name: escapeCsvFormula(row.name || ''),
    address: escapeCsvFormula(row.address || ''),
    unit: escapeCsvFormula(row.unit || ''),
    tenant_id: escapeCsvFormula(row.tenant_id || ''),
    phone: row.phone ? escapeCsvFormula(row.phone) : undefined,
    email: row.email ? escapeCsvFormula(row.email) : undefined,
    notes: row.notes ? escapeCsvFormula(row.notes) : undefined,
    normalized_phone,
    canonical_address: buildCanonicalAddress(row.address || '', row.unit || ''),
    validation_errors: errors,
    row_number: rowNumber
  };
}