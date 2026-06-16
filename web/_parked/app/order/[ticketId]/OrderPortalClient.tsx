'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
    CheckCircle2, MapPin, Wrench, Loader2, AlertCircle,
    CalendarClock, ThumbsUp, Building2, Phone, Clock, ChevronRight,
    MessageSquare, AlertTriangle
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { translateCategory } from '@/lib/translations'
import type { Ticket } from '@/lib/types'

interface Props {
    ticket: Ticket & { appointment_date?: string | null; contractor_confirmed_at?: string | null }
    orgLogoUrl?: string | null
    orgName?: string | null
}

// Step logic:
// 0 = "Bereits vergeben"   (confirmed by someone else before this session)
// 1 = "Auftrag bestätigen" (initial state)
// 2 = "Termin eintragen"   (after confirming IN THIS SESSION)
// 3 = "Erledigt"           (final state)

function getInitialStep(ticket: Props['ticket']): 0 | 1 | 2 | 3 {
    if (ticket.status === 'RESOLVED') return 3
    // If already confirmed on page load, this is a different contractor or a refresh.
    // Show "Vergeben" to prevent accidental appointment overwrite.
    if (ticket.contractor_confirmed_at) return 0
    return 1
}

function formatGerman(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    })
}

export default function OrderPortalClient({ ticket, orgLogoUrl, orgName }: Props) {
    const [step, setStep] = useState<0 | 1 | 2 | 3>(getInitialStep(ticket))
    const [isUpdating, setIsUpdating] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [appointmentDate, setAppointmentDate] = useState('')
    const [savedAppointment, setSavedAppointment] = useState<string | null>(ticket.appointment_date ?? null)
    const [appointmentLocked, setAppointmentLocked] = useState(!!ticket.appointment_date)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showConfirmWarning, setShowConfirmWarning] = useState(false)
    const [showResolveWarning, setShowResolveWarning] = useState(false)

    const callApi = async (payload: object) => {
        const res = await fetch('/api/public/ticket-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: ticket.id, ...payload }),
        }).then(r => r.json())
        if (res.error) throw new Error(res.error)
        return res
    }

    // ── Step 1: Confirm ─────────────────────────────────────────────────
    const handleConfirm = async () => {
        setIsUpdating(true)
        setFeedback(null)
        try {
            await callApi({ action: 'confirm' })
            setFeedback({ type: 'success', message: 'Auftrag bestätigt! Bitte tragen Sie jetzt Ihren Termin ein.' })
            setStep(2)
        } catch (e: any) {
            setFeedback({ type: 'error', message: e.message || 'Fehler beim Bestätigen' })
        } finally {
            setIsUpdating(false)
        }
    }

    // ── Step 2: Set Appointment ─────────────────────────────────────────
    const handleSetAppointment = async () => {
        setShowConfirmModal(false)
        setIsUpdating(true)
        setFeedback(null)
        try {
            await callApi({ action: 'set_appointment', appointment_date: appointmentDate })
            setSavedAppointment(appointmentDate)
            setAppointmentLocked(true)
            setFeedback({ type: 'success', message: `Termin fixiert. Der Mieter wurde per SMS informiert.` })
        } catch (e: any) {
            setFeedback({ type: 'error', message: e.message || 'Fehler beim Speichern des Termins' })
        } finally {
            setIsUpdating(false)
        }
    }

    // ── Step 3: Resolve ─────────────────────────────────────────────────
    const handleMarkDone = async () => {
        setIsUpdating(true)
        setFeedback(null)
        try {
            await callApi({ action: 'resolve' })
            setFeedback({ type: 'success', message: 'Auftrag abgeschlossen! Die Hausverwaltung wurde informiert.' })
            setStep(3)
        } catch (e: any) {
            setFeedback({ type: 'error', message: e.message || 'Fehler beim Abschließen' })
        } finally {
            setIsUpdating(false)
        }
    }

    const urgencyColors: Record<string, string> = {
        EMERGENCY: 'bg-red-100 text-red-700 border-red-200',
        HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
        MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
        LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
    const urgencyBadge = urgencyColors[ticket.urgency ?? ''] ?? 'bg-slate-100 text-slate-600 border-slate-200'

    const urgencyLabels: Record<string, string> = {
        EMERGENCY: 'Notfall', HIGH: 'Hoch', MEDIUM: 'Mittel', LOW: 'Niedrig'
    }

    const isDone = step === 3
    const isTaken = step === 0

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center">
            <div className="w-full max-w-md bg-white min-h-screen shadow-xl flex flex-col border-x border-slate-200">

                {/* ── Header ── */}
                <header className="p-6 pb-5 border-b border-slate-100 bg-white shrink-0">
                    {/* Org Branding */}
                    {(orgLogoUrl || orgName) && (
                        <div className="flex items-center gap-3 mb-5">
                            {orgLogoUrl ? (
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                    <Image src={orgLogoUrl} alt={orgName || 'Logo'} width={180} height={48} unoptimized className="h-12 w-auto max-w-[180px] object-contain" />
                                </div>
                            ) : (
                                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-slate-400" />
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-base leading-tight text-slate-900">{orgName || 'Hausverwaltung'}</p>
                                <p className="text-slate-400 text-xs font-semibold mt-0.5 uppercase tracking-wider">Auftragsportal</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Ticket #{ticket.ticket_code || '---'}
                        </span>
                        {ticket.urgency && (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${urgencyBadge}`}>
                                {urgencyLabels[ticket.urgency] ?? ticket.urgency}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 leading-tight mb-1">Reparaturauftrag</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                        <Wrench className="w-4 h-4 text-[#19e66f]" />
                        <span>{translateCategory(ticket.category)}</span>
                    </div>
                </header>

                <main className="flex-1 p-5 space-y-4 overflow-y-auto">

                    {/* ── Progress Steps ── */}
                    <div className="flex items-center gap-1 py-2">
                        {[
                            { num: 1, label: 'Bestätigen' },
                            { num: 2, label: 'Termin' },
                            { num: 3, label: 'Erledigt' },
                        ].map((s, i) => (
                            <div key={s.num} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step > s.num
                                        ? 'bg-[#19e66f] border-[#19e66f] text-white'
                                        : step === s.num
                                            ? 'bg-white border-[#19e66f] text-[#19e66f]'
                                            : 'bg-white border-slate-200 text-slate-300'
                                        }`}>
                                        {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                                    </div>
                                    <p className={`text-[9px] font-bold mt-1 uppercase tracking-wider ${step >= s.num ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {s.label}
                                    </p>
                                </div>
                                {i < 2 && (
                                    <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full ${step > s.num ? 'bg-[#19e66f]' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Feedback ── */}
                    {feedback && (
                        <div className={`p-4 rounded-2xl flex items-start gap-3 border ${feedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                            {feedback.type === 'success'
                                ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                            <p className="text-sm font-bold leading-snug">{feedback.message}</p>
                        </div>
                    )}

                    {/* Sensitive details — hidden once the order is taken by another contractor */}
                    {!isTaken && (
                        <>
                            {/* ── Einsatzort ── */}
                            <section className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="size-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                                    <MapPin className="w-5 h-5 text-[#19e66f]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Einsatzort</p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {ticket.address || 'Adresse nicht angegeben'}
                                        {ticket.unit && <span className="block text-xs font-medium text-slate-500 mt-0.5">Einheit: {ticket.unit}</span>}
                                    </p>
                                </div>
                            </section>

                            {/* ── Schadensbeschreibung ── */}
                            <section className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Schadensbeschreibung</p>
                                <p className="text-sm font-semibold leading-relaxed text-slate-800">{ticket.issue_summary}</p>
                                {ticket.issue_details && (
                                    <div className="mt-3 p-3 rounded-xl bg-white border border-slate-100">
                                        <p className="text-xs text-slate-500 leading-relaxed italic">{ticket.issue_details}</p>
                                    </div>
                                )}
                            </section>

                            {/* ── Ansprechpartner ── */}
                            {ticket.caller_name && (
                                <section className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ansprechpartner vor Ort</p>
                                    <p className="text-sm font-bold text-slate-800">{ticket.caller_name}</p>
                                    {ticket.caller_phone && (
                                        <a href={`tel:${ticket.caller_phone}`}
                                            className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-semibold text-[#19e66f] hover:bg-slate-50 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            {ticket.caller_phone}
                                        </a>
                                    )}
                                </section>
                            )}

                            {/* ── Gespeicherter Termin ── */}
                            {savedAppointment && (
                                <section className="flex items-start gap-4 p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                                    <div className="size-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-emerald-100">
                                        <Clock className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Ihr Termin</p>
                                        <p className="text-sm font-bold text-emerald-800">{formatGerman(savedAppointment)}</p>
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {/* ══════════════════════════════════════════════ */}
                    {/* ── STEP ACTIONS ── */}
                    {/* ══════════════════════════════════════════════ */}
                    <section className="pt-2 pb-8 space-y-3">

                        {/* ── Step 0: Bereits vergeben ── */}
                        {isTaken && (
                            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-amber-50 rounded-[2rem] border-2 border-amber-200">
                                <AlertCircle className="w-16 h-16 text-amber-500" />
                                <div className="text-center">
                                    <p className="text-xl font-black text-amber-800">Auftrag bereits vergeben</p>
                                    <p className="text-sm text-amber-700 mt-2 font-medium leading-snug">
                                        Dieser Auftrag wurde bereits von einem anderen Handwerker angenommen.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Step 1: Bestätigen ── */}
                        {step === 1 && (
                            <Dialog.Root open={showConfirmWarning} onOpenChange={setShowConfirmWarning}>
                                <Dialog.Trigger asChild>
                                    <button
                                        disabled={isUpdating}
                                        className="w-full flex items-center justify-between gap-4 p-6 bg-[#19e66f] hover:bg-[#14cc60] active:scale-[0.98] text-white rounded-[2rem] shadow-lg shadow-emerald-200 transition-all disabled:opacity-60 disabled:active:scale-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            {isUpdating ? <Loader2 className="w-7 h-7 animate-spin" /> : <ThumbsUp className="w-7 h-7" />}
                                            <div className="text-left">
                                                <p className="text-base font-black uppercase tracking-wider leading-tight">Auftrag bestätigen</p>
                                                <p className="text-xs font-semibold text-white/80 mt-0.5">Ich nehme den Auftrag an</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 opacity-70 shrink-0" />
                                    </button>
                                </Dialog.Trigger>

                                <Dialog.Portal>
                                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0" />
                                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                                                <AlertCircle className="w-7 h-7 text-amber-500" />
                                            </div>
                                            <div>
                                                <Dialog.Title className="text-lg font-black text-slate-900 leading-tight">
                                                    Auftrag verbindlich annehmen?
                                                </Dialog.Title>
                                                <Dialog.Description className="text-sm text-slate-500 mt-2 leading-snug">
                                                    Bitte bestätigen Sie den Auftrag nur, wenn Sie den Termin <span className="font-bold text-slate-700">sicher durchführen können</span> und bereits telefonisch Kontakt aufgenommen haben.
                                                </Dialog.Description>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 pt-1">
                                            <button
                                                onClick={() => { setShowConfirmWarning(false); handleConfirm(); }}
                                                disabled={isUpdating}
                                                className="w-full flex items-center justify-center gap-2 p-4 bg-[#19e66f] hover:bg-[#14cc60] active:scale-[0.98] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-200 transition-all disabled:opacity-60"
                                            >
                                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsUp className="w-5 h-5" />}
                                                Ja, Auftrag annehmen
                                            </button>
                                            <Dialog.Close asChild>
                                                <button className="w-full p-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                                    Abbrechen
                                                </button>
                                            </Dialog.Close>
                                        </div>
                                    </Dialog.Content>
                                </Dialog.Portal>
                            </Dialog.Root>
                        )}

                        {/* ── Step 2: Termin eintragen ── */}
                        {step === 2 && (
                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Voraussichtlicher Termin</p>

                                    {appointmentLocked && savedAppointment ? (
                                        /* Locked state: appointment confirmed */
                                        <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <p className="text-sm font-black text-emerald-800">
                                                    Termin bestätigt für den {formatGerman(savedAppointment)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setAppointmentLocked(false)
                                                    setAppointmentDate(savedAppointment)
                                                }}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors"
                                            >
                                                <AlertTriangle className="w-3 h-3" />
                                                Termin ändern (neue SMS wird gesendet)
                                            </button>
                                        </div>
                                    ) : (
                                        /* Editable state */
                                        <input
                                            type="datetime-local"
                                            value={appointmentDate}
                                            onChange={e => setAppointmentDate(e.target.value)}
                                            min={new Date().toISOString().slice(0, 16)}
                                            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#19e66f] focus:outline-none text-sm font-semibold text-slate-800 bg-white transition-colors"
                                        />
                                    )}
                                </div>

                                {!appointmentLocked && (
                                    <Dialog.Root open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                                        <Dialog.Trigger asChild>
                                            <button
                                                disabled={isUpdating || !appointmentDate}
                                                className="w-full flex items-center justify-between gap-4 p-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:active:scale-100"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <MessageSquare className="w-6 h-6" />}
                                                    <p className="text-sm font-black uppercase tracking-wider">Termin fixieren & Mieter informieren</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 opacity-70 shrink-0" />
                                            </button>
                                        </Dialog.Trigger>

                                        <Dialog.Portal>
                                            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0" />
                                            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95">
                                                <div className="flex flex-col items-center text-center gap-3">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center">
                                                        <MessageSquare className="w-7 h-7 text-[#19e66f]" />
                                                    </div>
                                                    <div>
                                                        <Dialog.Title className="text-lg font-black text-slate-900 leading-tight">
                                                            Termin verbindlich buchen?
                                                        </Dialog.Title>
                                                        <Dialog.Description className="text-sm text-slate-500 mt-1.5 leading-snug">
                                                            {ticket.caller_name
                                                                ? <><span className="font-bold text-slate-700">{ticket.caller_name}</span> wird</>
                                                                : 'Der Mieter wird'}{' '}
                                                            {ticket.caller_phone
                                                                ? <span>unter <span className="font-bold text-slate-700">{ticket.caller_phone}</span></span>
                                                                : null}{' '}
                                                            sofort per SMS über diesen Termin informiert.
                                                        </Dialog.Description>
                                                    </div>
                                                    {appointmentDate && (
                                                        <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Termin</p>
                                                            <p className="text-sm font-bold text-slate-800">{formatGerman(appointmentDate)}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2 pt-1">
                                                    <button
                                                        onClick={handleSetAppointment}
                                                        disabled={isUpdating}
                                                        className="w-full flex items-center justify-center gap-2 p-4 bg-[#19e66f] hover:bg-[#14cc60] active:scale-[0.98] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-200 transition-all disabled:opacity-60"
                                                    >
                                                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                                                        Jetzt fixieren & senden
                                                    </button>
                                                    <Dialog.Close asChild>
                                                        <button className="w-full p-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                                            Abbrechen
                                                        </button>
                                                    </Dialog.Close>
                                                </div>
                                            </Dialog.Content>
                                        </Dialog.Portal>
                                    </Dialog.Root>
                                )}

                                {/* Mark done from step 2 — with confirmation guard */}
                                <Dialog.Root open={showResolveWarning} onOpenChange={setShowResolveWarning}>
                                    <Dialog.Trigger asChild>
                                        <button
                                            disabled={isUpdating}
                                            className="w-full flex items-center justify-center gap-3 p-4 bg-white hover:bg-red-50 active:scale-[0.98] text-slate-700 hover:text-red-700 rounded-2xl border-2 border-slate-200 hover:border-red-300 transition-all disabled:opacity-50 disabled:active:scale-100"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-slate-400" />
                                            <p className="text-sm font-black uppercase tracking-wider">Direkt als erledigt markieren</p>
                                        </button>
                                    </Dialog.Trigger>

                                    <Dialog.Portal>
                                        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0" />
                                        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95">
                                            <div className="flex flex-col items-center text-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center">
                                                    <AlertCircle className="w-7 h-7 text-red-500" />
                                                </div>
                                                <div>
                                                    <Dialog.Title className="text-lg font-black text-slate-900 leading-tight">
                                                        Auftrag wirklich abschließen?
                                                    </Dialog.Title>
                                                    <Dialog.Description className="text-sm text-slate-500 mt-2 leading-snug">
                                                        Diese Aktion ist <span className="font-bold text-red-600">nicht rückgängig</span> zu machen. Die Hausverwaltung wird sofort informiert und das Ticket wird auf <span className="font-bold text-slate-700">Erledigt</span> gesetzt.
                                                    </Dialog.Description>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 pt-1">
                                                <button
                                                    onClick={() => { setShowResolveWarning(false); handleMarkDone(); }}
                                                    disabled={isUpdating}
                                                    className="w-full flex items-center justify-center gap-2 p-4 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-red-200 transition-all disabled:opacity-60"
                                                >
                                                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                    Ja, Auftrag abschließen
                                                </button>
                                                <Dialog.Close asChild>
                                                    <button className="w-full p-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                                        Abbrechen
                                                    </button>
                                                </Dialog.Close>
                                            </div>
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                        )}

                        {/* ── Step 3: Done ── */}
                        {isDone && (
                            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-emerald-50 rounded-[2rem] border-2 border-emerald-200">
                                <div className="relative">
                                    <CheckCircle2 className="w-20 h-20 text-[#19e66f]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-emerald-800">Auftrag erledigt!</p>
                                    <p className="text-xs text-emerald-600 mt-1 font-medium">Die Hausverwaltung wurde automatisch informiert.</p>
                                </div>
                            </div>
                        )}
                    </section>

                </main>

                <footer className="p-6 bg-slate-50 border-t border-slate-100 shrink-0 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                        ©{new Date().getFullYear()} Callfolio · Auftragsportal
                    </p>
                </footer>

            </div>
        </div>
    )
}
