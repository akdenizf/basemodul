"use client";

import React, { useState } from "react";
import {
    CheckCircle2,
    AlertTriangle,
    Clock,
    ChevronRight,
    Mail,
    PhoneForwarded,
    Wrench,
    ArrowRight,
    Camera,
    Loader2,
    CalendarClock
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { translateUrgency, getCategoryConfig } from "@/lib/translations";
import type { Ticket, TicketStatus } from "@/lib/types";
import TicketAttachments from "../TicketAttachments";
import ActivityTimeline from "../ActivityTimeline";
import ContractorSection from "./ContractorSection";
import TicketStatusPanel from "./TicketStatusPanel";
import StatusConfirmModal from "./StatusConfirmModal";

interface TicketListItemProps {
    ticket: Ticket;
    isSelected: boolean;
    onClick: () => void;
    onEmailClick?: () => void;
    onContractorEmail?: (contractorId: string) => void;
    onStatusChange?: (ticketId: string, newStatus: string) => void;
}

const UrgencyColor = (urgency: string | undefined): string => {
    switch (urgency) {
        case 'EMERGENCY': return 'bg-red-500';
        case 'HIGH': return 'bg-orange-500';
        case 'MEDIUM': return 'bg-amber-400';
        case 'LOW': return 'bg-slate-400';
        default: return 'bg-slate-400';
    }
};

export default function TicketListItem({ ticket, isSelected, onClick, onEmailClick, onContractorEmail, onStatusChange }: TicketListItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [confirmTargetStatus, setConfirmTargetStatus] = useState<TicketStatus | null>(null);

    const executeStatusUpdate = async (targetStatus: TicketStatus) => {
        if (isUpdatingStatus) return;
        setIsUpdatingStatus(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const res = await fetch(`/api/tickets/${ticket.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                body: JSON.stringify({ status: targetStatus }),
            });
            if (res.ok) onStatusChange?.(ticket.id, targetStatus);
        } catch (e) {
            console.error('Status update failed:', e);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Show the real caller name whenever we have one — independent of match_type.
    // The old match_type gate hid names that patch_data had already written to
    // caller_name (e.g. tenants who registered via the SMS portal).
    const cleanName = (v: string | null | undefined): string => {
        const s = (v ?? "").trim();
        if (s.length < 2) return "";
        if (/^[+\d\s\-()]+$/.test(s)) return "";               // phone-shaped, not a name
        if (s.toLowerCase().startsWith("unbekannt")) return ""; // placeholder
        return s;
    };
    const displayName =
        cleanName(ticket.caller_name) ||
        cleanName(ticket.raw_caller_name) ||
        ticket.caller_phone ||
        "Unbekannte Nummer";

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const isOlderThan24h = (Date.now() - new Date(ticket.created_at).getTime()) > 24 * 60 * 60 * 1000;
    const waitingForPhotos = ticket.status === 'NEW' && (ticket.attachment_count ?? 0) === 0;
    const urgencyColor = UrgencyColor(ticket.urgency);
    const categoryConfig = getCategoryConfig(ticket.category);
    const isActive = ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED';

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative bg-white dark:bg-[#151921] rounded-xl transition-all duration-200 flex flex-col shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${isSelected
                ? "border border-slate-900 dark:border-slate-300 ring-1 ring-slate-900/10 dark:ring-slate-300/10 z-10"
                : "border border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
        >
            {/* Horizontal Scroll Wrapper for narrow/portrait screens */}
            <div className="w-full overflow-x-auto">
                <div className="flex items-stretch min-h-[5rem]" style={{ minWidth: '780px' }}>
                    {/* Left: Vertical Status Bar */}
                    <div className={`w-1.5 shrink-0 ${urgencyColor}`} />

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col md:flex-row items-start md:items-center p-3 gap-3 md:gap-4">

                    {/* ID Block */}
                    <div className="flex flex-col items-center justify-center min-w-[4rem] shrink-0 gap-1.5 self-stretch border-r border-slate-100 dark:border-slate-800/50 pr-4 md:pr-6">
                        <span className="font-mono text-[11px] font-bold text-slate-400">
                            #{ticket.ticket_code || ticket.ticket_id?.slice(0, 4)}
                        </span>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${urgencyColor}`}>
                            {translateUrgency(ticket.urgency)}
                        </div>
                        <div className={`text-[10px] font-bold font-mono text-center leading-tight uppercase tracking-wider ${isOlderThan24h ? 'text-orange-500' : 'text-slate-500'}`}>
                            {formatDate(ticket.created_at).split(',')[1]} <br />
                            <span className={`text-[9px] font-mono ${isOlderThan24h ? 'text-orange-400' : 'text-slate-400'}`}>{formatDate(ticket.created_at).split(',')[0]}</span>
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0 self-center">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white truncate tracking-[-0.02em]">
                                {ticket.issue_summary || "Keine Zusammenfassung"}
                            </h3>
                            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                                {/* Category Badge */}
                                <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${categoryConfig.bgClass} ${categoryConfig.textClass} ${categoryConfig.borderClass}`}>
                                    <span>{categoryConfig.icon}</span>
                                    {categoryConfig.label}
                                </span>

                                {ticket.match_type === 'MATCH' && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#12b355] bg-[#19e66f]/10 px-2 py-0.5 rounded-md border border-[#19e66f]/20 uppercase tracking-wider">
                                        <CheckCircle2 size={10} /> Match
                                    </span>
                                )}
                                {ticket.requires_manual_review && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 uppercase tracking-wider">
                                        <AlertTriangle size={10} /> Prüfen
                                    </span>
                                )}
                                {(ticket.follow_up_count ?? 0) > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20 uppercase tracking-wider">
                                        <PhoneForwarded size={10} /> {(ticket.follow_up_count ?? 0) + 1} Anrufe
                                    </span>
                                )}
                                {ticket.contractor_confirmed_at && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border text-[#12b355] bg-[#19e66f]/10 border-[#19e66f]/20 uppercase tracking-wider">
                                        <Wrench size={10} />
                                        Bestätigt
                                    </span>
                                )}
                                {!ticket.contractor_confirmed_at && ticket.status === 'IN_PROGRESS' && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border text-blue-600 bg-blue-500/10 border-blue-500/20 uppercase tracking-wider">
                                        <Wrench size={10} />
                                        Handwerker aktiv
                                    </span>
                                )}
                                {ticket.appointment_date && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 uppercase tracking-wider">
                                        <CalendarClock size={10} />
                                        {new Date(ticket.appointment_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                                {waitingForPhotos && (
                                    <span
                                        className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 uppercase tracking-wider"
                                        title="Warte auf Mieter-Fotos"
                                    >
                                        <Camera size={10} /> Fotos
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-6 text-[13px] mt-1.5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">Name</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{displayName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">Telefon</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{ticket.caller_phone || "---"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em]">ID / Adresse</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={ticket.address || ""}>
                                    {ticket.address ? ticket.address.split(',').pop()?.trim() : "---"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-2 self-center shrink-0 transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>

                        {/* Status action buttons — compact, always sm:visible */}
                        {isActive && (
                            <div className="flex items-center gap-1.5">
                                {ticket.status === 'NEW' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmTargetStatus('IN_PROGRESS'); }}
                                        disabled={isUpdatingStatus}
                                        title="Status auf In Bearbeitung setzen"
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-lg text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors disabled:opacity-50"
                                    >
                                        {isUpdatingStatus ? <Loader2 size={10} className="animate-spin" /> : <ArrowRight size={10} />}
                                        In Bearb.
                                    </button>
                                )}
                                {(ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS') && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmTargetStatus('RESOLVED'); }}
                                        disabled={isUpdatingStatus}
                                        title="Als erledigt markieren"
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#19e66f]/10 border border-[#19e66f]/20 rounded-lg text-[11px] font-bold text-[#12b355] dark:text-[#19e66f] hover:bg-[#19e66f]/20 transition-colors disabled:opacity-50"
                                    >
                                        {isUpdatingStatus ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                                        Erledigt
                                    </button>
                                )}
                            </div>
                        )}

                        {onEmailClick && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEmailClick(); }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 transition-colors shadow-sm"
                            >
                                <Mail size={14} />
                                <span>E-Mail</span>
                            </button>
                        )}

                        <button
                            onClick={onClick}
                            className={`p-2 rounded-full transition-colors ${isSelected
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <ChevronRight size={18} className="transition-transform duration-200" />
                        </button>
                    </div>

                </div>
            </div>
            </div>

            {/* Expanded Details */}
            {isSelected && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-[#0F1116]/30 animate-in slide-in-from-top-2">
                    <div className="pt-3 grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Left Column: AI Summary & Visuals */}
                        <div className="space-y-3">
                            <div className="bg-[#F0FDF4] dark:bg-emerald-950/15 p-4 rounded-xl border border-slate-100 dark:border-slate-800 border-l-2 border-l-[#19E66F]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-2">
                                    KI-Zusammenfassung
                                </p>
                                <p className="font-display text-[15px] text-slate-800 dark:text-slate-200 leading-relaxed tracking-[-0.01em]">
                                    {ticket.issue_details || ticket.issue_summary}
                                </p>
                            </div>

                            <ContractorSection
                                ticketId={ticket.id}
                                currentContractorId={ticket.contractor_id}
                                contractorConfirmedAt={ticket.contractor_confirmed_at}
                                appointmentDate={ticket.appointment_date}
                                onContractorEmail={onContractorEmail}
                            />

                            <TicketStatusPanel ticket={ticket} />

                            {/* Visual Context */}
                            <TicketAttachments ticketId={ticket.id} className="bg-white dark:bg-[#151921] p-5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" />
                        </div>

                        {/* Right Column: Activity Timeline */}
                        <div className="space-y-3">
                            <div className="bg-white dark:bg-[#151921] rounded-xl border border-[#E2E8F0] dark:border-slate-800 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                                <ActivityTimeline ticketId={ticket.id} className="mt-0 border-0 shadow-none p-5" />
                            </div>

                            {/* Status switcher — integrated action row */}
                            {isActive && (
                                <div className="flex gap-2">
                                    {ticket.status === 'NEW' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setConfirmTargetStatus('IN_PROGRESS'); }}
                                            disabled={isUpdatingStatus}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#151921] border border-[#E2E8F0] dark:border-slate-800 rounded-lg text-[12px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors disabled:opacity-60"
                                        >
                                            {isUpdatingStatus ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
                                            In Bearbeitung setzen
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmTargetStatus('RESOLVED'); }}
                                        disabled={isUpdatingStatus}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white border border-slate-900 dark:border-white rounded-lg text-[12px] font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-60"
                                    >
                                        {isUpdatingStatus ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                                        Als erledigt markieren
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {confirmTargetStatus && (
                <StatusConfirmModal
                    isOpen={!!confirmTargetStatus}
                    onClose={() => setConfirmTargetStatus(null)}
                    ticket={ticket}
                    targetStatus={confirmTargetStatus}
                    onConfirm={executeStatusUpdate}
                />
            )}
        </div>
    );
}
