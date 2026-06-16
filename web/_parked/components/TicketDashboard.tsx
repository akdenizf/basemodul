"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Filter,
  X,
  Mail,
  Loader2,
  ChevronDown,
  CheckCircle2,
  Ticket as TicketIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";
import type { Ticket, TicketSentiment, MatchType, TicketUrgency, TicketCategory, TicketStatus } from "@/lib/types";
import TicketListItem from "./dashboard/TicketListItem";
import TicketFilterBar from "./dashboard/TicketFilterBar";
import EmailPreviewModal, { EmailData } from "./EmailPreviewModal";
import { ModeToggle } from "./mode-toggle";
import TestEmailButton from "./TestEmailButton";

// Force dynamic rendering to avoid build-time Supabase errors
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

// --- UI-HELPER-KOMPONENTEN ---

const FilterSection = ({
  title,
  options,
  value,
  onChange,
  countMap
}: {
  title: string,
  options: { label: string, value: string, color?: string }[],
  value: string,
  onChange: (val: string) => void,
  countMap?: Record<string, number>
}) => (
  <div className="mb-6">
    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">{title}</h4>
    <div className="space-y-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${value === opt.value
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
        >
          <div className="flex items-center gap-2">
            {opt.color && <div className={`w-2 h-2 rounded-full ${opt.color}`} />}
            <span>{opt.label}</span>
          </div>
          {countMap && (
            <span className={`text-xs ${value === opt.value ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400'
              }`}>
              {countMap[opt.value] || 0}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

/** Skeleton row for loading states */
const TicketSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
        <div className="h-3 w-3/4 bg-slate-100 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// --- HAUPT-KOMPONENTE ---

export default function TicketDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Helper to get initial value from URL or fallback
  const getParam = (key: string, fallback: string) => searchParams.get(key) || fallback;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter States (sent to server) — Sync with URL
  const [statusFilter, setStatusFilter] = useState<string>(getParam('status', 'OPEN'));
  const [serverStatusCounts, setServerStatusCounts] = useState<Record<string, number>>({});
  const [serverUrgencyCounts, setServerUrgencyCounts] = useState<Record<string, number>>({});
  const [urgencyFilter, setUrgencyFilter] = useState<string>(getParam('urgency', 'ALL'));
  const [categoryFilter, setCategoryFilter] = useState<string>(getParam('category', 'ALL'));

  const [sortConfig, setSortConfig] = useState<{ by: string; direction: 'asc' | 'desc' }>({
    by: getParam('sortBy', 'priority'),
    direction: getParam('sortDir', 'desc') as 'asc' | 'desc'
  });

  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({
    from: getParam('from', ''),
    to: getParam('to', '')
  });

  const [searchQuery, setSearchQuery] = useState(getParam('q', ''));
  const [debouncedSearch, setDebouncedSearch] = useState(getParam('q', ''));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Modal States
  const [selectedTicketForEmail, setSelectedTicketForEmail] = useState<Ticket | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSendState, setEmailSendState] = useState<{
    status: 'idle' | 'sending' | 'success';
    message: string;
  }>({ status: 'idle', message: '' });
  const [preselectedTemplateId, setPreselectedTemplateId] = useState<string | null>(null);
  const [preselectedContractorId, setPreselectedContractorId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize Supabase client
  const supabase = useMemo(() => createClient(), []);

  // Search debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Logout Handler
  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  // Fetch Org Name
  const [orgName, setOrgName] = useState<string>('');
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('organizations(name)')
          .eq('user_id', user.id)
          .single();
        if (data?.organizations) {
          setOrgName((data.organizations as any).name);
        }
      }
    }
    loadProfile();
  }, [supabase]);

  // Fetch Tickets (with pagination)
  const loadTickets = useCallback(async (append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Keine aktive Session gefunden.');

      const currentOffset = append ? offset : 0;

      // Build query params
      const params = new URLSearchParams({
        offset: String(currentOffset),
        limit: String(PAGE_SIZE),
      });

      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (urgencyFilter !== 'ALL') params.set('urgency', urgencyFilter);
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());

      const response = await fetch(`/api/tickets?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      const newTickets: Ticket[] = result.tickets || [];

      if (append) {
        setTickets(prev => [...prev, ...newTickets]);
      } else {
        setTickets(newTickets);
      }

      setTotalCount(result.totalCount ?? 0);
      setHasMore(result.hasMore ?? false);
      setOffset(currentOffset + newTickets.length);

      // Update server-side counts for sidebar
      if (result.statusCounts) setServerStatusCounts(result.statusCounts);
      if (result.urgencyCounts) setServerUrgencyCounts(result.urgencyCounts);

    } catch (err: any) {
      console.error("TicketDashboard: Error loading tickets:", err);
      if (!append) {
        setTickets([]);
        setTotalCount(0);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [supabase, statusFilter, urgencyFilter, debouncedSearch, offset]);

  // Update URL whenever filters change (Persistence)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Sync only if changed to avoid loop
    const updates: Record<string, string | null> = {
      status: statusFilter !== 'OPEN' ? statusFilter : null,
      urgency: urgencyFilter !== 'ALL' ? urgencyFilter : null,
      category: categoryFilter !== 'ALL' ? categoryFilter : null,
      sortBy: sortConfig.by !== 'priority' ? sortConfig.by : null,
      sortDir: sortConfig.direction !== 'desc' ? sortConfig.direction : null,
      q: debouncedSearch.trim() || null,
      from: dateRange.from || null,
      to: dateRange.to || null
    };

    let changed = false;
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        if (params.get(key) !== val) {
          params.set(key, val);
          changed = true;
        }
      } else {
        if (params.has(key)) {
          params.delete(key);
          changed = true;
        }
      }
    });

    if (changed) {
      router.replace(`${pathname}?${params.toString()}` as any, { scroll: false });
    }
  }, [statusFilter, urgencyFilter, categoryFilter, sortConfig, debouncedSearch, dateRange, pathname, router, searchParams]);

  // Initial load + reload when filters change
  const prevFiltersRef = useRef({ statusFilter, urgencyFilter, debouncedSearch });

  useEffect(() => {
    const prev = prevFiltersRef.current;
    const filtersChanged =
      prev.statusFilter !== statusFilter ||
      prev.urgencyFilter !== urgencyFilter ||
      prev.debouncedSearch !== debouncedSearch;

    prevFiltersRef.current = { statusFilter, urgencyFilter, debouncedSearch };

    // Always reset offset and do fresh load when filters change
    setOffset(0);
    loadTickets(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, statusFilter, urgencyFilter, debouncedSearch]);

  const handleLoadMore = () => {
    loadTickets(true);
  };

  // Client-side sorts (the data is already server-filtered)
  const sortedTickets = useMemo(() => {
    // Apply client-side category filter (not sent to server for simplicity)
    let filtered = tickets;
    if (categoryFilter !== 'ALL') {
      filtered = tickets.filter(t => t.category === categoryFilter);
    }

    // Date range filter (client-side)
    if (dateRange.from) {
      filtered = filtered.filter(t => new Date(t.created_at) >= new Date(dateRange.from!));
    }
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setDate(endDate.getDate() + 1);
      filtered = filtered.filter(t => new Date(t.created_at) < endDate);
    }

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.by) {
        case 'priority':
          const urgencyOrder: Record<string, number> = { EMERGENCY: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          comparison = (urgencyOrder[a.urgency || 'LOW'] || 0) - (urgencyOrder[b.urgency || 'LOW'] || 0);
          break;
        case 'created_at':
          const timeA = new Date(a.updated_at || a.created_at).getTime();
          const timeB = new Date(b.updated_at || b.created_at).getTime();
          comparison = timeA - timeB;
          break;
        case 'age':
          // Oldest first: smallest timestamp = oldest
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        default:
          break;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [tickets, categoryFilter, sortConfig, dateRange]);

  // Counts for filters (use server-side DB counts when available, fallback to local)
  const counts = useMemo(() => {
    if (Object.keys(serverStatusCounts).length > 0) {
      // Add virtual OPEN count = NEW
      const enrichedStatus: Record<string, number> = { ...serverStatusCounts };
      enrichedStatus['OPEN'] = (enrichedStatus['NEW'] || 0);
      const enrichedUrgency: Record<string, number> = { ...serverUrgencyCounts };
      return { status: enrichedStatus, urgency: enrichedUrgency };
    }
    // Fallback: compute from loaded tickets
    const statusCounts: Record<string, number> = { ALL: totalCount };
    const urgencyCounts: Record<string, number> = { ALL: totalCount };

    tickets.forEach(t => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      urgencyCounts[t.urgency] = (urgencyCounts[t.urgency] || 0) + 1;
    });

    return { status: statusCounts, urgency: urgencyCounts };
  }, [tickets, totalCount, serverStatusCounts, serverUrgencyCounts]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Email Sending
  const handleSendEmail = async (emailData: EmailData) => {
    if (!selectedTicketForEmail) return;

    setEmailSendState({ status: 'sending', message: 'E-Mail wird versendet...' });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setToastMessage({ type: 'error', text: 'Keine aktive Session gefunden.' });
        setEmailSendState({ status: 'idle', message: '' });
        return;
      }

      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ticket_id: selectedTicketForEmail.id,
          recipient_type: emailData.recipient_type,
          recipient_email: emailData.recipient_email,
          subject: emailData.subject,
          body: emailData.body,
          html_body: emailData.html_body,
          template_type: emailData.template_type,
          update_status: emailData.recipient_type === 'contractor',
          new_status: emailData.recipient_type === 'contractor' ? 'IN_PROGRESS' : undefined,
          contractor_id: emailData.contractor_id,
          contractor_name: emailData.contractor_name,
          org_name: emailData.org_name
        }),
      });

      if (response.ok) {
        const isContractorOrder = emailData.recipient_type === 'contractor';

        // DIRECT status update — don't rely on send-email to do it
        if (isContractorOrder && selectedTicketForEmail) {
          try {
            await fetch(`/api/tickets/${selectedTicketForEmail.id}/status`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ status: 'IN_PROGRESS' }),
            });
            console.log('[Dashboard] ✅ Status direkt auf IN_PROGRESS gesetzt');
          } catch (e) {
            console.warn('[Dashboard] Status-Update fehlgeschlagen:', e);
          }
        }

        const successMsg = isContractorOrder ? 'Auftrag versendet & Status aktualisiert' : `E-Mail gesendet an ${emailData.recipient_email}`;

        setEmailSendState({
          status: 'success',
          message: successMsg
        });

        setOffset(0);
        loadTickets(false);
        setIsEmailModalOpen(false);
        setSelectedTicketForEmail(null);

        // Hide overlay after 2.5s
        setTimeout(() => {
          setEmailSendState({ status: 'idle', message: '' });
        }, 2500);

      } else {
        const result = await response.json();
        throw new Error(result.error || 'E-Mail konnte nicht gesendet werden');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setToastMessage({ type: 'error', text: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}` });
      setEmailSendState({ status: 'idle', message: '' });
    }
  };

  const handleContractorEmail = (ticket: Ticket, contractorId: string) => {
    setSelectedTicketForEmail(ticket);
    setPreselectedTemplateId('contractor_assignment');
    setPreselectedContractorId(contractorId);
    setIsEmailModalOpen(true);
  };

  // Error State for missing env vars
  if (!getSupabaseUrl() || !getSupabasePublishableKey()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Konfigurationsfehler</h2>
          <p className="text-slate-500">.env.local Variablen fehlen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1A1C1E] font-sans overflow-hidden">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Page Header */}
        <div className="shrink-0 px-8 py-6 border-b border-slate-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
              <TicketIcon size={20} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Tickets</h1>
              <p className="text-[13px] text-slate-500 font-medium">
                {isLoading ? 'Laden…' : `${totalCount} Tickets gesamt`}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Filter Sidebar (250px) */}
          <div className="w-64 bg-white dark:bg-[#151921] border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto p-4 shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter size={16} /> Filter
              </h3>
              {(statusFilter !== 'ALL' || urgencyFilter !== 'ALL') && (
                <button
                  onClick={() => { setStatusFilter('ALL'); setUrgencyFilter('ALL'); setCategoryFilter('ALL'); }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <FilterSection
              title="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              countMap={counts.status}
              options={[
                { label: 'Offen', value: 'OPEN', color: 'bg-amber-400' },
                { label: 'Beauftragt', value: 'IN_PROGRESS', color: 'bg-blue-500' },
                { label: 'Erledigt', value: 'RESOLVED', color: 'bg-[#19e66f]' },
                { label: 'Alle Tickets', value: 'ALL', color: 'bg-slate-400' }
              ]}
            />

            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-2" />

            <FilterSection
              title="Priorität"
              value={urgencyFilter}
              onChange={setUrgencyFilter}
              countMap={counts.urgency}
              options={[
                { label: 'Alle Prioritäten', value: 'ALL' },
                { label: 'Notfall', value: 'EMERGENCY', color: 'bg-red-500' },
                { label: 'Hoch', value: 'HIGH', color: 'bg-orange-500' },
                { label: 'Mittel', value: 'MEDIUM', color: 'bg-amber-400' },
                { label: 'Niedrig', value: 'LOW', color: 'bg-slate-400' }
              ]}
            />

          </div>

          {/* Right Content: Ticket List Cards */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#F8FAFC]">

            <TicketFilterBar
              onSearch={setSearchQuery}
              onSortChange={setSortConfig}
              onDateRangeChange={setDateRange}
              totalResults={sortedTickets.length}
              initialSearch={getParam('q', '')}
              initialSortBy={getParam('sortBy', 'priority')}
              initialSortDir={getParam('sortDir', 'desc') as 'asc' | 'desc'}
              initialDateFrom={getParam('from', '')}
              initialDateTo={getParam('to', '')}
            />

            {/* Counter bar */}
            <div className="flex-shrink-0 px-6 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-[#151921]/50 backdrop-blur-sm">
              <span>
                {isLoading ? (
                  <span className="inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Lade Tickets…</span>
                ) : (
                  <>{tickets.length} von {totalCount} Tickets geladen</>
                )}
              </span>
              {debouncedSearch && (
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  Suche: &quot;{debouncedSearch}&quot;
                </span>
              )}
            </div>

            <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar transition-opacity duration-200 ${isLoading && tickets.length > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="space-y-4 min-h-full">
                {isLoading && tickets.length === 0 ? (
                  /* Skeleton loading (Initial load only) */
                  <>
                    {[...Array(5)].map((_, i) => (
                      <TicketSkeleton key={i} />
                    ))}
                  </>
                ) : sortedTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-100">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-4">
                      <Search className="text-slate-300" size={24} />
                    </div>
                    <p className="text-slate-900 text-[14px] font-bold">Keine Tickets gefunden</p>
                    <p className="text-slate-400 text-[13px] font-medium mt-1">Passen Sie Ihre Filter oder den Suchbegriff an.</p>
                    {(statusFilter !== 'ALL' || urgencyFilter !== 'ALL' || debouncedSearch) && (
                      <button
                        onClick={() => { setStatusFilter('ALL'); setUrgencyFilter('ALL'); setCategoryFilter('ALL'); setSearchQuery(''); }}
                        className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[12px] font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                      >
                        Filter zurücksetzen
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {sortedTickets.map(ticket => (
                      <TicketListItem
                        key={ticket.id}
                        ticket={ticket}
                        isSelected={selectedId === ticket.id}
                        onClick={() => setSelectedId(selectedId === ticket.id ? null : ticket.id)}
                        onEmailClick={() => {
                          setSelectedTicketForEmail(ticket);
                          setPreselectedTemplateId(null);
                          setPreselectedContractorId(null);
                          setIsEmailModalOpen(true);
                        }}
                        onContractorEmail={(contractorId) => handleContractorEmail(ticket, contractorId)}
                        onStatusChange={() => {
                          setSelectedId(null);
                          setOffset(0);
                          loadTickets(false);
                          setToastMessage({ type: 'success', text: 'Ticket als erledigt markiert' });
                        }}
                      />
                    ))}

                    {/* "Mehr laden" Button */}
                    {hasMore && (
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="w-full py-3 mt-2 bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoadingMore ? (
                          <><Loader2 size={16} className="animate-spin" /> Laden…</>
                        ) : (
                          <><ChevronDown size={16} /> Mehr laden ({totalCount - tickets.length} verbleibend)</>
                        )}
                      </button>
                    )}

                    {/* Skeleton rows during load-more */}
                    {isLoadingMore && (
                      <div className="space-y-4 mt-2">
                        {[...Array(3)].map((_, i) => (
                          <TicketSkeleton key={`more-${i}`} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Email Send Overlay */}
      <AnimatePresence>
        {emailSendState.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4 border border-slate-100"
            >
              {emailSendState.status === 'sending' ? (
                <>
                  <div className="w-20 h-20 bg-slate-50 border border-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-6">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 mb-2 text-center">
                    E-Mail wird gesendet…
                  </h3>
                  <p className="text-slate-500 text-center text-sm font-medium">
                    Dieser Vorgang dauert einen Moment.
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-[#19e66f]/10 border border-[#19e66f]/20 text-[#12b355] rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 mb-2 text-center">
                    Erfolgreich versendet
                  </h3>
                  <p className="text-slate-500 text-center text-sm font-medium">
                    {emailSendState.message}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedTicketForEmail && (
        <EmailPreviewModal
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedTicketForEmail(null);
            setPreselectedTemplateId(null);
            setPreselectedContractorId(null);
          }}
          ticket={selectedTicketForEmail}
          onSend={handleSendEmail}
          preselectedTemplateId={preselectedTemplateId}
          preselectedContractorId={preselectedContractorId}
          orgName={orgName}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-4 duration-200 flex items-center gap-2 ${toastMessage.type === 'success'
          ? 'bg-slate-900 text-white'
          : 'bg-red-500 text-white'
          }`}>
          {toastMessage.type === 'success' ? (
            <svg className="w-5 h-5 text-[#19e66f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium text-sm">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
