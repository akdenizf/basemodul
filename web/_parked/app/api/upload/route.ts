import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ============================================================
// CALLFOLIO v5.4 - Photo Upload API Route
// ============================================================
// Handles file uploads from the unauthenticated upload page.
// Validates ticket existence before accepting uploads.
// ============================================================

const STORAGE_BUCKET = "ticket-evidence";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: NextRequest) {
  console.log("[Upload] Received upload request");

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const ticketId = formData.get("ticketId") as string | null;

    // Validate inputs
    if (!file) {
      console.warn("[Upload] No file provided");
      return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 });
    }

    if (!ticketId) {
      console.warn("[Upload] No ticketId provided");
      return NextResponse.json({ error: "Ticket-ID fehlt" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.warn(`[Upload] Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: "Ungültiger Dateityp. Erlaubt: JPEG, PNG, WebP" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.warn(`[Upload] File too large: ${file.size} bytes`);
      return NextResponse.json(
        { error: "Datei zu groß. Maximal 10 MB erlaubt." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("id, ticket_code")
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      console.warn(`[Upload] Ticket not found: ${ticketId}`);
      return NextResponse.json({ error: "Ticket nicht gefunden" }, { status: 404 });
    }

    console.log(`[Upload] Uploading for ticket ${ticket.ticket_code}`);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = (file.name.split(".").pop() || "jpg").replace(/[^a-zA-Z0-9]/g, '');
    const storagePath = `${ticketId}/${timestamp}.${extension}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`[Storage] Upload failed: ${uploadError.message}`);
      return NextResponse.json(
        { error: "Upload fehlgeschlagen. Bitte versuchen Sie es erneut." },
        { status: 500 }
      );
    }

    console.log(`[Storage] File uploaded: ${uploadData.path}`);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    // Insert record into ticket_attachments
    const { data: attachment, error: attachmentError } = await supabase
      .from("ticket_attachments")
      .insert({
        ticket_id: ticketId,
        file_url: fileUrl,
        storage_path: storagePath,
      })
      .select("id")
      .single();

    if (attachmentError) {
      console.error(`[Upload] Failed to save attachment record: ${attachmentError.message}`);
      // Don't fail the request - file is uploaded, just log the error
    }

    // Log activity
    try {
      await supabase.from("ticket_activities").insert({
        ticket_id: ticketId,
        activity_type: "attachment_uploaded",
        description: "Foto vom Mieter hochgeladen",
        metadata: { attachment_id: attachment?.id, storage_path: storagePath, file_url: fileUrl },
      });
    } catch (e) {
      // Non-critical, continue
      console.warn("[Upload] Activity log failed (non-critical)");
    }

    console.log(`[Upload] Success: ${fileUrl}`);

    return NextResponse.json({
      success: true,
      fileUrl,
      attachmentId: attachment?.id,
    });
  } catch (error: any) {
    console.error(`[Upload] Exception: ${error.message}`);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
