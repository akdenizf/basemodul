"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, Users, Loader2, ChevronDown } from 'lucide-react';
import TenantListItem from '@/components/tenants/TenantListItem';
import CreateTenantDialog from '@/components/tenants/CreateTenantDialog';
import EditTenantDialog from '@/components/tenants/EditTenantDialog';
import type { Tenant } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 50;

/** Skeleton row for loading states */
const TenantSkeleton = () => (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm animate-pulse">
        <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-4 w-40 bg-slate-100 rounded" />
                <div className="h-3 w-56 bg-slate-50 rounded" />
            </div>
            <div className="h-6 w-24 bg-slate-50 rounded-lg" />
        </div>
    </div>
);

export default function TenantList() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [filterType, setFilterType] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');
    const [orgSlug, setOrgSlug] = useState<string>('');
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    // Pagination
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const supabase = useMemo(() => createClient(), []);

    // Search debounce (300ms)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadOrgSlug = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/settings/get-organization', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!response.ok) return;

            const { organization } = await response.json();
            if (organization?.slug) setOrgSlug(organization.slug);
        } catch (err) {
            console.error('[TenantList] Error loading org slug:', err);
        }
    }, [supabase]);

    const loadTenants = useCallback(async (append: boolean = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsLoading(false);
                return;
            }

            const currentOffset = append ? offset : 0;

            const params = new URLSearchParams({
                offset: String(currentOffset),
                limit: String(PAGE_SIZE),
            });

            if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());

            const response = await fetch(`/api/tenants?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                console.error('[TenantList] API error:', response.status);
                setIsLoading(false);
                return;
            }

            const result = await response.json();

            // Map DB fields to our Tenant type
            const mapped: Tenant[] = (result.tenants || []).map((t: any) => {
                const fullName = t.name || `${t.first_name || ''} ${t.last_name || ''}`.trim();
                const finalName = fullName || t.email || "Unbekannter Mieter";

                const combinedAddress = `${t.street || ''} ${t.zip || ''} ${t.city || ''}`.trim();
                const finalAddress = t.address || combinedAddress || "Keine Adresse";

                return {
                    id: t.id,
                    tenant_id: t.tenant_id || "",
                    name: finalName,
                    first_name: t.first_name || null,
                    last_name: t.last_name || null,
                    address: finalAddress,
                    street: t.street || null,
                    house_number: t.house_number || null,
                    zip: t.zip || null,
                    city: t.city || null,
                    unit: t.unit || "",
                    phone: t.phone || t.phone_number || null,
                    email: t.email || null,
                    created_at: t.created_at,
                    notes: t.notes || null,
                };
            });

            if (append) {
                setTenants(prev => [...prev, ...mapped]);
            } else {
                setTenants(mapped);
            }

            setTotalCount(result.totalCount ?? mapped.length);
            setHasMore(result.hasMore ?? false);
            setOffset(currentOffset + mapped.length);
        } catch (err) {
            console.error('[TenantList] Error loading tenants:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [supabase, debouncedSearch, offset]);

    // Initial load + reload when search changes
    useEffect(() => {
        loadOrgSlug();
    }, [loadOrgSlug]);

    const prevSearchRef = useRef(debouncedSearch);
    useEffect(() => {
        prevSearchRef.current = debouncedSearch;
        setOffset(0);
        loadTenants(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supabase, debouncedSearch]);

    const handleLoadMore = () => {
        loadTenants(true);
    };

    // Handle edit tenant
    const handleEdit = useCallback((tenantId: string) => {
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
            setSelectedTenant(tenant);
            setEditDialogOpen(true);
        }
    }, [tenants]);

    // Client-side filter for verified/unverified (not sent to server)
    const filteredTenants = tenants.filter(tenant => {
        const isVerified = !!tenant.phone;
        if (filterType === 'VERIFIED') return isVerified;
        if (filterType === 'UNVERIFIED') return !isVerified;
        return true;
    });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">

            {/* Header */}
            <header className="flex-shrink-0 px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 relative shadow-sm">
                <div>
                    <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                            <Users className="w-6 h-6" />
                        </div>
                        Mieter & Objekte
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500 mt-2 ml-[3.25rem]">
                        Verwalte alle Mieter und deren Kontaktdaten.
                    </p>
                </div>

                <CreateTenantDialog onTenantCreated={() => { setOffset(0); loadTenants(false); }} />
            </header>

            {/* Filter Bar */}
            <div className="flex-shrink-0 px-8 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-[28rem]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Suchen nach Namen, Adresse..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] sm:text-[14px] transition-all shadow-sm"
                    />
                </div>

                {/* Filter Tabs + Counter */}
                <div className="flex items-center gap-6">
                    <span className="text-[13px] font-bold text-slate-500 whitespace-nowrap">
                        {isLoading ? (
                            <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin text-[#19e66f]" /> Laden…</span>
                        ) : (
                            <>{tenants.length} von {totalCount} Mieter geladen</>
                        )}
                    </span>

                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button
                            onClick={() => setFilterType('ALL')}
                            className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'}`}
                        >
                            Alle ({tenants.length})
                        </button>
                        <button
                            onClick={() => setFilterType('VERIFIED')}
                            className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all ${filterType === 'VERIFIED' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'}`}
                        >
                            Verifiziert
                        </button>
                        <button
                            onClick={() => setFilterType('UNVERIFIED')}
                            className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all ${filterType === 'UNVERIFIED' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'}`}
                        >
                            Unvollständig
                        </button>
                    </div>
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto space-y-4">
                    {isLoading ? (
                        /* Skeleton loading */
                        <>
                            {[...Array(5)].map((_, i) => (
                                <TenantSkeleton key={i} />
                            ))}
                        </>
                    ) : filteredTenants.length > 0 ? (
                        <>
                            {filteredTenants.map(tenant => (
                                <TenantListItem key={tenant.id} tenant={tenant} onEdit={handleEdit} />
                            ))}

                            {/* "Mehr laden" Button */}
                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="w-full py-4 mt-2 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                                >
                                    {isLoadingMore ? (
                                        <><Loader2 size={18} className="animate-spin text-[#19e66f]" /> Laden…</>
                                    ) : (
                                        <><ChevronDown size={18} /> Mehr laden ({totalCount - tenants.length} verbleibend)</>
                                    )}
                                </button>
                            )}

                            {/* Skeleton rows during load-more */}
                            {isLoadingMore && (
                                <div className="space-y-4 mt-2">
                                    {[...Array(3)].map((_, i) => (
                                        <TenantSkeleton key={`more-${i}`} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                <Users className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                                {tenants.length === 0 ? "Noch keine Mieter angelegt" : "Keine Mieter gefunden"}
                            </h3>
                            <p className="text-[15px] font-medium text-slate-500 max-w-md">
                                {tenants.length === 0
                                    ? "Starten Sie mit dem Import von Daten oder legen Sie einen Mieter manuell an."
                                    : "Versuchen Sie es mit einem anderen Suchbegriff oder Filter."}
                            </p>
                            {tenants.length === 0 && (
                                <a
                                    href="/import"
                                    className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-[13px] font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                                >
                                    Zum CSV-Import
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Tenant Dialog */}
            {selectedTenant && (
                <EditTenantDialog
                    tenant={selectedTenant}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onTenantUpdated={() => { setOffset(0); loadTenants(false); }}
                />
            )}
        </div>
    );
}
