import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || null;
  const allowedEmails: string[] = [];

  if (adminEmailsEnv) {
    allowedEmails.push(...adminEmailsEnv.split(',').map(email => email.trim()));
  }

  // Fallback to single ADMIN_EMAIL if ADMIN_EMAILS not set
  if (allowedEmails.length === 0) {
    const singleAdminEmail = process.env.ADMIN_EMAIL;
    if (singleAdminEmail) {
      allowedEmails.push(singleAdminEmail.trim());
    }
  }

  const currentUser = await getCurrentUserFromRequest(req);

  const hasUser = !!currentUser;
  const email = currentUser?.email || null;
  const allowlisted = email ? allowedEmails.includes(email) : false;

  return NextResponse.json({
    hasUser,
    email,
    allowlisted,
    adminEmailsEnv,
    configuredAdminEmails: allowedEmails,
  });
}
