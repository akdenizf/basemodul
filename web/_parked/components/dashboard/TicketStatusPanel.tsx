"use client";

import React from "react";
import { CheckCircle2, CalendarClock, Inbox, Wrench, CircleDot } from "lucide-react";
import type { Ticket } from "@/lib/types";

// ============================================================
// TicketStatusPanel – "Status at a Glance" for expanded ticket view
// Shows current status + key milestones derived from ticket fields
// ============================================================

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    NEW:         { label: "Neu eingegangen",  color: "text-sky-600 dark:text-sky-400",     dot: "bg-sky-500" },
    IN_PROGRESS: { label: "In Bearbeitung",   color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
    RESOLVED:    { label: "Abgeschlossen",    color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
    CLOSED:      { label: "Geschlossen",      color: "text-slate-500 dark:text-slate-400", dot: "bg-slate-400" },
};

function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("de-DE", {
        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
}

interface Milestone {
    key: string;
    label: string;
    sublabel?: string;
    date: string | null;
    state: "done" | "current" | "pending";
    icon: React.ReactNode;
}

interface Props {
    ticket: Ticket;
}

export default function TicketStatusPanel({ ticket }: Props) {
    const cfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.NEW;
    const isResolved = ticket.status === "RESOLVED" || ticket.status === "CLOSED";

    // Derive appointment display string
    const apptLabel = ticket.appointment_date
        ? new Date(ticket.appointment_date).toLocaleDateString("de-DE", {
            weekday: "short", day: "2-digit", month: "short",
            hour: "2-digit", minute: "2-digit",
          })
        : null;

    const milestones: Milestone[] = [
        {
            key: "created",
            label: "Ticket erstellt",
            date: ticket.created_at,
            state: "done",
            icon: <Inbox className="w-3.5 h-3.5" />,
        },
        {
            key: "inprogress",
            label: "In Bearbeitung",
            date: null,
            state: ticket.status !== "NEW" ? "done" : "pending",
            icon: <CircleDot className="w-3.5 h-3.5" />,
        },
        {
            key: "confirmed",
            label: "Handwerker bestätigt",
            sublabel: ticket.contractor_confirmed_at ? fmt(ticket.contractor_confirmed_at) : undefined,
            date: ticket.contractor_confirmed_at ?? null,
            state: ticket.contractor_confirmed_at ? "done" : ticket.status === "IN_PROGRESS" ? "current" : "pending",
            icon: <Wrench className="w-3.5 h-3.5" />,
        },
        {
            key: "appointment",
            label: "Termin geplant",
            sublabel: apptLabel ?? undefined,
            date: null,
            state: ticket.appointment_date ? "done" : ticket.contractor_confirmed_at ? "current" : "pending",
            icon: <CalendarClock className="w-3.5 h-3.5" />,
        },
        {
            key: "resolved",
            label: "Abgeschlossen",
            date: isResolved ? (ticket.updated_at ?? ticket.created_at) : null,
            state: isResolved ? "done" : "pending",
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Header */}
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Ticket-Status
            </p>

            {/* Current status badge */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border mb-4 ${
                ticket.status === "NEW"
                    ? "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800"
                    : ticket.status === "IN_PROGRESS"
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                    : ticket.status === "RESOLVED"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
            }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${ticket.status === "IN_PROGRESS" ? "animate-pulse" : ""}`} />
                <span className={`text-[11px] font-bold ${cfg.color}`}>{cfg.label}</span>
            </div>

            {/* Milestone timeline */}
            <div className="space-y-0">
                {milestones.map((m, i) => {
                    const isLast = i === milestones.length - 1;
                    return (
                        <div key={m.key} className="flex gap-3">
                            {/* Icon column with connector line */}
                            <div className="flex flex-col items-center">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors ${
                                    m.state === "done"
                                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                                        : m.state === "current"
                                        ? "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"
                                }`}>
                                    {m.icon}
                                </div>
                                {!isLast && (
                                    <div className={`w-px flex-1 my-0.5 min-h-[12px] ${
                                        m.state === "done" ? "bg-emerald-200 dark:bg-emerald-900" : "bg-slate-100 dark:bg-slate-800"
                                    }`} />
                                )}
                            </div>

                            {/* Label column */}
                            <div className={`pb-3 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
                                <div className="flex items-baseline justify-between gap-2 pt-0.5">
                                    <span className={`text-[11px] font-semibold leading-tight ${
                                        m.state === "done"
                                            ? "text-slate-700 dark:text-slate-200"
                                            : m.state === "current"
                                            ? "text-amber-700 dark:text-amber-300"
                                            : "text-slate-300 dark:text-slate-600"
                                    }`}>
                                        {m.label}
                                    </span>
                                    {m.date && (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                                            {fmt(m.date)}
                                        </span>
                                    )}
                                </div>
                                {m.sublabel && !m.date && (
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{m.sublabel}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
