import { Tenant } from './types';

/**
 * Raw CSV row data as parsed from uploaded file
 */
export interface ImportRow {
  // Required fields
  name: string;
  address: string;
  unit: string;
  tenant_id: string;
  
  // Optional fields
  phone?: string;
  email?: string;
  notes?: string;
}

/**
 * Processed row after validation and normalization
 */
export interface NormalizedRow extends ImportRow {
  // Processed data
  normalized_phone: string | null;
  canonical_address: string;
  validation_errors: string[];
  row_number?: number; // For error reporting
}

/**
 * Row with conflict information
 */
export interface ConflictRow extends NormalizedRow {
  conflict_reason: string;
  existing_tenant?: Tenant;
}

/**
 * Row with validation errors
 */
export interface ErrorRow extends NormalizedRow {
  errors: string[];
}

/**
 * Complete import analysis result
 */
export interface ImportResult {
  valid_rows: NormalizedRow[];
  conflict_rows: ConflictRow[];
  error_rows: ErrorRow[];
  summary: {
    total: number;
    valid: number;
    conflicts: number;
    errors: number;
  };
}