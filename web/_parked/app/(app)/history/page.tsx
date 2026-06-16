"use client";

import AuthGuard from '@/components/AuthGuard';
import HistoryPageClient from '@/components/HistoryPageClient';

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryPageClient />
    </AuthGuard>
  );
}