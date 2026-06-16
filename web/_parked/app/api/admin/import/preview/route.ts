import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateRow, buildCanonicalAddress, normalizePhoneNumber } from "@/lib/import-utils";
import type { ImportRow, NormalizedRow } from "@/lib/import-types";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

// ============================================================
// CALLFOLIO v5.2 - IMPORT PREVIEW (CLEAN ARCHITECTURE)
// ============================================================

export const dynamic = 'force-dynamic';

interface PreviewRequest {
  rows: any[];
}

interface PreviewResponse {
  validRows: Array<{
    rowIndex: number;
    status: 'VALID_NEW' | 'VALID_UPDATE';
    normalized: NormalizedRow;
    reason?: string;
  }>;
  conflicts: Array<{
    rowIndex: number;
    reason: string;
    details: any;
  }>;
  errors: Array<{
    rowIndex: number;
    field: string;
    reason: string;
  }>;
  stats: {
    total: number;
    valid: number;
    conflict: number;
    error: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Debug: Log incoming cookies
    console.log('[IMPORT DEBUG] Cookies received:', req.cookies.getAll().map(c => c.name).join(', '));

    // Authorization check using Supabase authentication
    // Expected behaviors:
    // - Unauthenticated -> 401
    // - Authenticated but not allowlisted -> 403  
    // - Allowlisted -> access granted
    const authResult = await requireUserWithOrganizationFromRequest(req);

    console.log('[IMPORT DEBUG] Auth result:', {
      ok: authResult.ok,
      status: authResult.status,
      user_id: authResult.user_id,
      email: authResult.email,
      organization_id: authResult.organization_id,
      organization_slug: authResult.organization_slug,
      error: authResult.error
    });

    if (!authResult.ok) {
      const message = authResult.status === 401
        ? "Authentication required"
        : "Forbidden: Admin access required";

      console.error('[IMPORT DEBUG] Auth failed:', message, authResult.error);

      return NextResponse.json(
        { error: message, debug: authResult.error },
        { status: authResult.status }
      );
    }

    // v5.2: Hole organization_id und organization_slug
    const organizationId = authResult.organization_id;
    const organizationSlug = authResult.organization_slug || authResult.tenant_id_string;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Ihre Organisation konnte nicht ermittelt werden. Bitte stellen Sie sicher, dass Ihr Konto einer Organisation zugeordnet ist." },
        { status: 403 }
      );
    }

    // Parse request body
    let body: PreviewRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { rows } = body;

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Field 'rows' must be an array" },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No rows provided for import" },
        { status: 400 }
      );
    }

    // Initialize response arrays
    const validRows: PreviewResponse['validRows'] = [];
    const conflicts: PreviewResponse['conflicts'] = [];
    const errors: PreviewResponse['errors'] = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const rowIndex = i + 1; // 1-based for user display
      const rawRow = rows[i];

      try {
        // Convert to ImportRow format
        // v5.2: tenant_id wird aus organization_slug abgeleitet (für Legacy-Kompatibilität)
        const importRow: ImportRow = {
          name: rawRow.name || '',
          address: rawRow.address || '',
          unit: rawRow.unit || '',
          tenant_id: organizationSlug || 'imported', // Legacy-Feld
          phone: rawRow.phone || undefined,
          email: rawRow.email || undefined,
          notes: rawRow.notes || undefined
        };

        // Server-side validation using validateRow
        const normalizedRow = validateRow(importRow, rowIndex);

        // If validation errors exist, add to errors array
        if (normalizedRow.validation_errors.length > 0) {
          for (const error of normalizedRow.validation_errors) {
            errors.push({
              rowIndex,
              field: 'validation',
              reason: error
            });
          }
          continue; // Skip conflict checking for invalid rows
        }

        // DRY-RUN: Read-only database conflict checks
        await checkForConflicts(normalizedRow, rowIndex, organizationId, validRows, conflicts);

      } catch (rowError: any) {
        console.error(`Error processing row ${rowIndex}:`, rowError);
        errors.push({
          rowIndex,
          field: 'processing',
          reason: `Row processing failed: ${rowError.message || 'Unknown error'}`
        });
      }
    }

    // Calculate stats
    const stats = {
      total: rows.length,
      valid: validRows.length,
      conflict: conflicts.length,
      error: errors.length
    };

    const response: PreviewResponse = {
      validRows,
      conflicts,
      errors,
      stats
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Import preview API error:", error);

    // Structured error response for 500s
    return NextResponse.json(
      {
        error: "Server error during import preview",
        message: error?.message || "Unknown server error",
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Performs read-only database checks for conflicts
 * NO database writes - only SELECT queries
 */
async function checkForConflicts(
  normalizedRow: NormalizedRow,
  rowIndex: number,
  organizationId: string,
  validRows: PreviewResponse['validRows'],
  conflicts: PreviewResponse['conflicts']
): Promise<void> {
  try {
    const { tenant_id, normalized_phone, canonical_address } = normalizedRow;

    // Check 1: Phone conflict (if phone provided)
    if (normalized_phone) {
      const { data: phoneConflicts, error: phoneError } = await supabaseAdmin
        .from('tenants')
        .select('id, tenant_id, name, phone, address, unit')
        .eq('organization_id', organizationId)
        .eq('phone', normalized_phone);

      if (phoneError) {
        throw new Error(`Phone conflict check failed: ${phoneError.message}`);
      }

      if (phoneConflicts && phoneConflicts.length > 0) {
        const conflictingTenant = phoneConflicts[0];

        // Phone belongs to different address within same organization
        const conflictingCanonical = buildCanonicalAddress(conflictingTenant.address, conflictingTenant.unit);

        if (conflictingCanonical !== canonical_address) {
          conflicts.push({
            rowIndex,
            reason: `Phone number ${normalized_phone} already exists for a different address`,
            details: {
              conflictType: 'phone',
              existingTenant: {
                name: conflictingTenant.name,
                address: conflictingTenant.address,
                unit: conflictingTenant.unit
              }
            }
          });
          return; // Skip further checks for this row
        }
      }
    }

    // Check 2: Address conflict
    const { data: addressConflicts, error: addressError } = await supabaseAdmin
      .from('tenants')
      .select('id, tenant_id, name, phone, address, unit, canonical_address')
      .eq('organization_id', organizationId)
      .eq('canonical_address', canonical_address);

    if (addressError) {
      throw new Error(`Address conflict check failed: ${addressError.message}`);
    }


    // Since we already checked for address conflicts scoped to organization,
    // we can determine NEW vs UPDATE based on that result
    const status = (addressConflicts && addressConflicts.length > 0) ? 'VALID_UPDATE' : 'VALID_NEW';
    const reason = status === 'VALID_UPDATE'
      ? `Will update existing tenant: ${addressConflicts[0].name}`
      : 'Will create new tenant record';

    validRows.push({
      rowIndex,
      status,
      normalized: normalizedRow,
      reason
    });

  } catch (dbError: any) {
    console.error(`Database conflict check failed for row ${rowIndex}:`, dbError);

    // Add to conflicts rather than errors since this is a DB issue, not validation
    conflicts.push({
      rowIndex,
      reason: `Database conflict check failed: ${dbError.message}`,
      details: {
        conflictType: 'database_error',
        error: dbError.message
      }
    });
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}