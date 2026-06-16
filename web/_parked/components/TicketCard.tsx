"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  Phone,
  ChevronDown,
  Mail,
  MoreHorizontal,
  User,
  ThumbsUp
} from "lucide-react";
import { translateUrgency } from "@/lib/translations";
import type { Ticket, MatchType, TicketStatus } from "@/lib/types";

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
  onEmailClick?: () => void;
}

const StatusBadge = ({ status }: { status?: TicketStatus }) => {
  const styles: Record<string, string> = {
    'NEW': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
    'RESOLVED': 'bg-green-100 text-green-700 border-green-200',
    'default': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  const labels: Record<string, string> = {
    'NEW': 'Neu',
    'IN_PROGRESS': 'Beauftragt',
    'RESOLVED': 'Erledigt',
    'CLOSED': 'Geschlossen'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles[status || 'default'] || styles.default}`}>
      {labels[status || ''] || status}
    </span>
  );
};

const UrgencyBadge = ({ urgency }: { urgency: string }) => {
  const styles: Record<string, string> = {
    'EMERGENCY': 'bg-red-100 text-red-700 border-red-200 animate-pulse',
    'HIGH': 'bg-orange-100 text-orange-700 border-orange-200',
    'MEDIUM': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'LOW': 'bg-blue-100 text-blue-700 border-blue-200',
    'default': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[urgency] || styles.default}`}>
      {translateUrgency(urgency)}
    </span>
  );
};

import TicketAttachments from "./TicketAttachments";
import ActivityTimeline from "./ActivityTimeline";

export default function TicketCard({ ticket, isSelected, onClick, onEmailClick }: TicketCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-white dark:bg-[#151921] rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 ${isSelected ? "ring-2 ring-slate-500" : ""
        }`}
    >
      <div className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">

        {/* Left: Avatar & ID */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              <Image
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                alt="Caller"
                width={48}
                height={48}
                unoptimized
                className="w-full h-full bg-slate-50 dark:bg-slate-800"
              />
            </div>
            {ticket.match_type === 'MATCH' && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white dark:border-[#151921]">
                <CheckCircle2 size={10} />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]" title={displayName}>
              {displayName}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                #{ticket.ticket_code || ticket.ticket_id?.slice(0, 6) || "---"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Issue Summary & Meta */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1 truncate">
              {ticket.issue_summary || "Keine Zusammenfassung"}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={12} />
              <span className="truncate" title={ticket.address || ""}>{ticket.address ? ticket.address.split(',').pop()?.trim() : "Keine Adresse"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex gap-2">
              <StatusBadge status={ticket.status} />
              <UrgencyBadge urgency={ticket.urgency} />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock size={12} />
              <span>{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Visible on Hover/Mobile) */}
        <div className={`flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity ${isHovered ? 'visible' : ''}`}>
          {onEmailClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onEmailClick(); }}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="E-Mail senden"
            >
              <Mail size={18} />
            </button>
          )}
          <button
            className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            onClick={onClick}
          >
            <ChevronDown size={18} />
          </button>
        </div>

      </div>

      {/* Expandable Content with Visual Context & Audit Log */}
      {isSelected && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: AI Summary & Photos */}
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">KI-Zusammenfassung</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {ticket.issue_details || ticket.issue_summary}
                </p>
              </div>

              {/* Visual Context: Photos */}
              <TicketAttachments ticketId={ticket.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800" />
            </div>

            {/* Right Column: Activity Timeline */}
            <div>
              <ActivityTimeline ticketId={ticket.id} className="mt-0" />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}