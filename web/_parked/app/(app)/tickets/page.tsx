"use client";

import AuthGuard from '@/components/AuthGuard';
import TicketDashboard from '@/components/TicketDashboard';

export default function TicketsPage() {
  return (
    <AuthGuard>
      <TicketDashboard />
    </AuthGuard>
  );
}
