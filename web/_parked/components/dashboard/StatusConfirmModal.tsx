"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import type { Ticket, TicketStatus } from "@/lib/types";

interface StatusConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket;
    targetStatus: TicketStatus;
    onConfirm: (targetStatus: TicketStatus) => Promise<void>;
}

export default function StatusConfirmModal({ isOpen, onClose, ticket, targetStatus, onConfirm }: StatusConfirmModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const isResolved = targetStatus === 'RESOLVED';
    const Icon = isResolved ? CheckCircle2 : ArrowRight;
    const title = isResolved ? 'Ticket als erledigt markieren?' : 'Ticket in Bearbeitung setzen?';
    const description = isResolved 
        ? 'Das Ticket wird als abgeschlossen markiert. Mieter und Handwerker können bei Bedarf benachrichtigt werden.'
        : 'Der Status wird auf "In Bearbeitung" gesetzt. Dies signalisiert, dass sich aktuell um das Problem gekümmert wird.';

    const confirmColor = isResolved 
        ? 'bg-[#19e66f] text-[#0f1714] hover:bg-[#15d163]' 
        : 'bg-blue-600 text-white hover:bg-blue-700';

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm(targetStatus);
            onClose();
        } catch (error) {
            console.error("Confirmation failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isResolved ? 'bg-[#19e66f]/20 text-[#12b355]' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                                Status ändern
                            </h2>
                            <p className="text-xs text-slate-400">Ticket #{ticket.ticket_code || ticket.id?.substring(0, 8)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        {description}
                    </p>
                    
                    {ticket.status === 'NEW' && targetStatus === 'RESOLVED' && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                                Dieses Ticket wurde noch nicht bearbeitet. Sind Sie sicher, dass Sie es direkt als erledigt markieren möchten?
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className={`font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Bitte warten…</>
                        ) : (
                            <>Bestätigen</>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
