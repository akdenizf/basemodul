import { NextResponse, NextRequest } from "next/server";
import {
  validateRow,
  NormalizedRow,
  ImportRow,
} from "@/lib/import-utils";
import { requireAdminUserFromRequest } from "@/lib/auth-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ============================================================
// CALLFOLIO v5.2 - IMPORT COMMIT (CLEAN ARCHITECTURE)
// ============================================================
// Mieter werden in tenants gespeichert mit organization_id
// NICHT mehr mit tenant_id als String!
// ============================================================

const supabaseServiceRole = getSupabaseAdmin();

interface CommitRequest {
  rows: ImportRow[];
}

interface CommitResponse {
  inserted?: number;
  updated?: number;
  stats?: {
    total: number;
  };
  error?: string;
  details?: any[];
}

export async function POST(req: NextRequest): Promise<NextResponse<CommitResponse>> {
  console.log('[IMPORT COMMIT] Starting import commit...');

  // 1) AUTHORIZATION
  const authCheck = await requireAdminUserFromRequest(req);
  console.log('[IMPORT COMMIT] Auth check:', {
    ok: authCheck.ok,
    email: authCheck.email,
    organization_id: authCheck.organization_id,
    organization_slug: authCheck.organization_slug
  });

  if (!authCheck.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authCheck.status });
  }

  // v5.2: Hole organization_id (UUID) statt tenant_id (String)
  const organizationId = authCheck.organization_id;
  const organizationSlug = authCheck.organization_slug;

  if (!organizationId) {
    return NextResponse.json(
      { error: "Ihre Organisation konnte nicht ermittelt werden. Bitte stellen Sie sicher, dass Ihr Konto einer Organisation zugeordnet ist." },
      { status: 403 }
    );
  }

  // 2) INPUT
  const body: CommitRequest = await req.json();
  const { rows } = body;

  if (!rows || !Array.isArray(rows)) {
    return NextResponse.json({ error: "Invalid input: 'rows' array is required" }, { status: 400 });
  }

  const validatedRows: NormalizedRow[] = [];
  const validationErrors: { row_number?: number; errors: string[] }[] = [];

  // 3) SERVER-SIDE RE-VALIDATION
  for (let i = 0; i < rows.length; i++) {
    const originalRow = rows[i];
    const rowNumber = i + 1;

    // v5.2: tenant_id wird ignoriert, wir nutzen organization_id
    originalRow.tenant_id = organizationSlug || 'imported';

    const validated = validateRow(originalRow, rowNumber);

    if (validated.validation_errors.length > 0) {
      validationErrors.push({ row_number: rowNumber, errors: validated.validation_errors });
    }
    validatedRows.push(validated);
  }

  if (validationErrors.length > 0) {
    console.log('[IMPORT COMMIT] Validation errors:', validationErrors);
    return NextResponse.json(
      { error: "VALIDATION_FAILED", details: validationErrors },
      { status: 400 }
    );
  }

  console.log('[IMPORT COMMIT] Validation passed for', validatedRows.length, 'rows');

  // 4) WRITE PHASE
  let insertedCount = 0;
  let updatedCount = 0;
  const errorsDuringWrite: any[] = [];

  console.log('[IMPORT COMMIT] Starting write phase for', validatedRows.length, 'rows');

  for (const row of validatedRows) {
    const {
      name,
      address,
      unit,
      email,
      notes,
      normalized_phone,
      canonical_address,
      row_number,
    } = row;

    try {
      console.log(`[IMPORT COMMIT] Processing row ${row_number}:`, { name, address, unit });

      // Check if tenant with this canonical_address already exists for this organization
      const { data: existingTenant, error: selectError } = await supabaseServiceRole
        .from("tenants")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("canonical_address", canonical_address)
        .maybeSingle();

      if (selectError) {
        console.error(`[IMPORT COMMIT] Select error for row ${row_number}:`, selectError);
        errorsDuringWrite.push({ row_number, error: selectError.message });
        continue;
      }

      if (existingTenant) {
        // Update existing tenant
        console.log(`[IMPORT COMMIT] Row ${row_number}: Updating existing tenant ${existingTenant.id}`);
        const updateData: Record<string, any> = {
          name,
          address,
          unit,
          updated_at: new Date().toISOString(),
        };
        if (normalized_phone) updateData.phone = normalized_phone;
        if (email) updateData.email = email;
        if (notes) updateData.notes = notes;

        const { error: updateError } = await supabaseServiceRole
          .from("tenants")
          .update(updateData)
          .eq("id", existingTenant.id);

        if (updateError) {
          console.error(`[IMPORT COMMIT] Update error for row ${row_number}:`, updateError);
          errorsDuringWrite.push({ row_number, error: updateError.message });
          continue;
        }
        updatedCount++;
      } else {
        // Insert new tenant with organization_id
        console.log(`[IMPORT COMMIT] Row ${row_number}: Inserting new tenant`);
        const insertData: Record<string, any> = {
          organization_id: organizationId,  // v5.2: UUID statt tenant_id String
          tenant_id: organizationSlug,      // Legacy-Feld für Kompatibilität
          name,
          address,
          unit,
          canonical_address,
        };
        if (normalized_phone) insertData.phone = normalized_phone;
        if (email) insertData.email = email;
        if (notes) insertData.notes = notes;

        const { error: insertError } = await supabaseServiceRole
          .from("tenants")
          .insert(insertData);

        if (insertError) {
          console.error(`[IMPORT COMMIT] Insert error for row ${row_number}:`, insertError);
          errorsDuringWrite.push({ row_number, error: insertError.message });
          continue;
        }
        insertedCount++;
      }
    } catch (err: any) {
      console.error(`[IMPORT COMMIT] Exception for row ${row_number}:`, err);
      errorsDuringWrite.push({ row_number, error: err.message || 'Unknown error' });
    }
  }

  console.log(`[IMPORT COMMIT] Complete. Inserted: ${insertedCount}, Updated: ${updatedCount}, Errors: ${errorsDuringWrite.length}`);

  if (errorsDuringWrite.length > 0) {
    console.error("[IMPORT COMMIT] Errors during write:", errorsDuringWrite);
    return NextResponse.json(
      { error: "WRITE_FAILED", details: errorsDuringWrite },
      { status: 500 }
    );
  }

  console.log(`CSV_IMPORT_COMMIT by ${authCheck.email}, inserted: ${insertedCount}, updated: ${updatedCount}`);

  return NextResponse.json({
    inserted: insertedCount,
    updated: updatedCount,
    stats: {
      total: validatedRows.length,
    },
  }, { status: 200 });
}
