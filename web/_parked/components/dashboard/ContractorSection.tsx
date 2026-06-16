"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Wrench, ChevronDown, Loader2, Mail, CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ============================================================
// ContractorSection – Dienstleister-Dropdown im Ticket-Detail
// ============================================================

interface Contractor {
    id: string;
    name: string;
    email: string;
    phone: string;
    trade: string;
}

interface Props {
    ticketId: string;
    currentContractorId?: string | null;
    contractorConfirmedAt?: string | null;
    appointmentDate?: string | null;
    onContractorEmail?: (contractorId: string) => void;
}

export default function ContractorSection({ ticketId, currentContractorId, contractorConfirmedAt, appointmentDate, onContractorEmail }: Props) {
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [selectedId, setSelectedId] = useState<string>(currentContractorId || "");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const supabase = useMemo(() => createClient(), []);

    // Load contractors once
    const loadContractors = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch("/api/contractors", {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });

            if (res.ok) {
                const { contractors: c } = await res.json();
                setContractors(c || []);
            }
        } catch (err) {
            console.error("[ContractorSection] load error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadContractors();
    }, [loadContractors]);

    // Sync with prop when ticket changes
    useEffect(() => {
        setSelectedId(currentContractorId || "");
    }, [currentContractorId]);

    const selectedContractor = useMemo(
        () => contractors.find(c => c.id === selectedId),
        [contractors, selectedId]
    );

    // Save assignment
    const handleChange = async (contractorId: string) => {
        setSelectedId(contractorId);
        setIsSaving(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            await fetch(`/api/tickets/${ticketId}/contractor`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ contractor_id: contractorId || null }),
            });
        } catch (err) {
            console.error("[ContractorSection] save error:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Dienstleister
            </p>

            {isLoading ? (
                /* Skeleton */
                <div className="space-y-2 animate-pulse">
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
            ) : contractors.length === 0 ? (
                <p className="text-xs text-slate-400">
                    Noch keine Dienstleister angelegt.{" "}
                    <a href="/settings" className="text-slate-700 dark:text-slate-300 font-semibold hover:underline">
                        Einstellungen →
                    </a>
                </p>
            ) : (
                <div className="space-y-3">
                    {/* Select */}
                    <div className="relative">
                        <select
                            value={selectedId}
                            onChange={(e) => handleChange(e.target.value)}
                            disabled={isSaving}
                            className="w-full appearance-none bg-slate-50 dark:bg-[#0F1116] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all pr-8 disabled:opacity-50"
                        >
                            <option value="">– Nicht zugewiesen –</option>
                            {contractors.map((c) => (
                                <option key={c.id} value={c.id}>
                                    [{c.trade}] {c.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                    </div>

                    {/* Info + Email shortcut */}
                    {selectedContractor && (
                        <div className="flex items-center justify-between gap-2 px-1">
                            <div className="text-xs text-slate-400 truncate">
                                <span className="font-medium text-slate-500 dark:text-slate-300">{selectedContractor.email}</span>
                                {selectedContractor.phone && (
                                    <span className="ml-2">· {selectedContractor.phone}</span>
                                )}
                            </div>
                            {onContractorEmail && (
                                <button
                                    onClick={() => onContractorEmail(selectedContractor.id)}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors shrink-0"
                                >
                                    <Mail className="w-3 h-3" />
                                    Beauftragen
                                </button>
                            )}
                        </div>
                    )}

                    {/* Contractor status — shown when contractor has interacted via portal */}
                    {contractorConfirmedAt && (
                        <div className="mt-2 flex flex-col gap-1.5 px-1">
                            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                Auftrag bestätigt am {new Date(contractorConfirmedAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {appointmentDate && (
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                    Termin: {new Date(appointmentDate).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
