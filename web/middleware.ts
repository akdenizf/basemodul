import { NextResponse, type NextRequest } from 'next/server'

// ============================================================
// AGENTEQ KMU ASSISTANTS — MIDDLEWARE (Lean MVP)
// ============================================================
// Der Lean-MVP ist eine reine Landing + simulierte Demo.
// Kein Auth, kein Supabase-Session-Refresh, keine Domain-Weiche.
// Das Backend (Dashboard/Tickets/Auth) ist unter _parked/ geparkt
// und wird erst beim echten Piloten wieder verdrahtet.
// ============================================================

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Statische Assets aus der Middleware ausnehmen.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
