'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/AuthGuard'
import {
    LayoutDashboard,
    Ticket,
    Users,
    Settings,
    Upload,
    Mail,
    ChevronDown,
    HelpCircle,
    Shield,
    Clock,
    CheckCircle2,
    FileText,
    Wrench,
    Phone,
} from 'lucide-react'

// --- Quick Start Cards ---
const quickStartItems = [
    {
        icon: <Ticket className="w-6 h-6 text-[#12b355]" />,
        iconBg: 'bg-[#19e66f]/10 border border-[#19e66f]/20',
        title: 'Ticket erstellen',
        description: 'Ein neues Schadens-Ticket wird automatisch per KI-Anruf oder manuell erstellt.',
        href: '/tickets',
    },
    {
        icon: <Users className="w-6 h-6 text-slate-600" />,
        iconBg: 'bg-slate-50 border border-slate-100',
        title: 'Mieter verwalten',
        description: 'Mieterstammdaten einsehen, bearbeiten oder neue Mieter anlegen.',
        href: '/tenants',
    },
    {
        icon: <Wrench className="w-6 h-6 text-slate-600" />,
        iconBg: 'bg-slate-50 border border-slate-100',
        title: 'Handwerker beauftragen',
        description: 'Einen Handwerker dem Ticket zuweisen und automatisch per E-Mail informieren.',
        href: '/tickets',
    },
    {
        icon: <Settings className="w-6 h-6 text-slate-600" />,
        iconBg: 'bg-slate-50 border border-slate-100',
        title: 'Einstellungen anpassen',
        description: 'Organisation, E-Mail-Templates und Handwerker-Stammdaten konfigurieren.',
        href: '/settings',
    },
]

// --- FAQ Data ---
const faqItems = [
    {
        question: 'Wie erstelle ich ein neues Ticket?',
        answer:
            'Tickets werden automatisch erstellt, wenn ein Mieter über die KI-Telefonzentrale anruft. Alternativ können Sie im Dashboard unter "Tickets" manuell ein neues Ticket anlegen.',
    },
    {
        question: 'Wie weise ich einem Handwerker einen Auftrag zu?',
        answer:
            'Öffnen Sie das betreffende Ticket und klicken Sie auf "Handwerker zuweisen". Wählen Sie einen Handwerker aus Ihrer Stammdatenliste. Callfolio sendet automatisch eine Auftrags-E-Mail an den Handwerker.',
    },
    {
        question: 'Was bedeuten die Ticket-Status NEW, IN_PROGRESS und RESOLVED?',
        answer:
            'NEW: Das Ticket wurde gerade erstellt (per KI oder manuell). IN_PROGRESS: Ein Handwerker wurde beauftragt und per E-Mail informiert. RESOLVED: Der Auftrag wurde als erledigt markiert.',
    },
    {
        question: 'Wie importiere ich Mieterdaten per CSV?',
        answer:
            'Gehen Sie zu "Import" in der Seitenleiste. Laden Sie eine CSV-Datei mit den Spalten Name, E-Mail, Telefon, Adresse und Wohnungsnummer hoch. Callfolio prüft die Daten automatisch auf Konflikte und Duplikate.',
    },
    {
        question: 'Wie ändere ich meine E-Mail-Templates?',
        answer:
            'Unter "Einstellungen" → Tab "Kommunikation" finden Sie alle aktiven E-Mail-Vorlagen. Sie können Betreff, Inhalt und Variablen (wie {{mieter_name}} oder {{ticket_code}}) frei anpassen. Eine Live-Vorschau zeigt Ihnen sofort das Ergebnis.',
    },
    {
        question: 'Ist Callfolio DSGVO-konform?',
        answer:
            'Ja. Alle Daten werden auf Servern in Frankfurt (EU) gespeichert. Callfolio verarbeitet personenbezogene Daten ausschließlich im Rahmen der Auftragsdatenverarbeitung. Auf Anfrage stellen wir Ihnen einen AV-Vertrag zur Verfügung.',
    },
    {
        question: 'Wie funktioniert die KI-Telefonzentrale?',
        answer:
            'Die KI nimmt eingehende Anrufe entgegen, identifiziert den Mieter anhand der Telefonnummer, erfasst das Anliegen in natürlicher Sprache und erstellt automatisch ein strukturiertes Ticket im Dashboard — rund um die Uhr, 7 Tage die Woche.',
    },
    {
        question: 'Kann ich Callfolio auch auf dem Smartphone nutzen?',
        answer:
            'Ja, das gesamte Dashboard ist responsiv und funktioniert auf Smartphone und Tablet. Es ist keine separate App nötig — einfach callfolio.io im mobilen Browser öffnen.',
    },
]

// --- FAQ Accordion Item ---
function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-slate-100 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 px-1 text-left group cursor-pointer bg-transparent border-none"
            >
                <span className="text-sm font-semibold text-slate-900 group-hover:text-[#12b355] transition-colors pr-4">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 group-hover:text-[#12b355] flex-shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#12b355]' : ''
                        }`}
                />
            </button>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <p className="text-sm text-slate-600 leading-relaxed pb-5 px-1">
                    {answer}
                </p>
            </div>
        </div>
    )
}

// --- Main Page ---
export default function HelpPage() {
    return (
        <AuthGuard>
            <div className="flex-1 p-6 md:p-10 bg-[#F8FAFC] h-full overflow-y-auto">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-display text-[30px] font-bold tracking-tighter text-slate-900 leading-tight">
                                Hilfe & Support
                            </h1>
                            <p className="text-[14px] font-medium text-slate-500 mt-1">
                                Antworten auf häufige Fragen und Anleitungen für den schnellen Einstieg.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Section A: Quick Start */}
                <section className="mb-12">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 mb-4 px-1">
                        Schnellstart
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickStartItems.map((item, i) => (
                            <Link key={i} href={item.href as any}>
                                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full">
                                    <div className={`p-3 rounded-xl ${item.iconBg} w-fit mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Section B: FAQ */}
                <section className="mb-12">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 mb-4 px-1">
                        Häufig gestellte Fragen
                    </h2>
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6">
                        {faqItems.map((faq, i) => (
                            <FaqItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </section>

                {/* Section C: Contact & Support */}
                <section className="mb-8">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 mb-4 px-1">
                        Kontakt & Support
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Support Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-[#19e66f]/10 border border-[#19e66f]/20">
                                    <Mail className="w-5 h-5 text-[#12b355]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">E-Mail Support</h3>
                                    <p className="text-xs text-slate-500">Antwort innerhalb von 24 Stunden</p>
                                </div>
                            </div>
                            <a
                                href="mailto:support@agenteq.de"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-[#12b355] transition-colors"
                            >
                                support@agenteq.de
                            </a>
                            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Mo – Fr, 9:00 – 17:00 Uhr</span>
                            </div>
                        </div>

                        {/* System Status Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-[#19e66f]/10 border border-[#19e66f]/20">
                                    <Shield className="w-5 h-5 text-[#12b355]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Systemstatus</h3>
                                    <p className="text-xs text-slate-500">Alle Systeme operativ</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs text-slate-600">KI-Telefonzentrale</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-[#19e66f] animate-pulse" />
                                        <span className="text-[11px] font-semibold text-[#12b355]">Online</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs text-slate-600">E-Mail-Versand</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-[#19e66f] animate-pulse" />
                                        <span className="text-[11px] font-semibold text-[#12b355]">Online</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs text-slate-600">Dashboard & API</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-[#19e66f] animate-pulse" />
                                        <span className="text-[11px] font-semibold text-[#12b355]">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[11px] text-slate-500 font-medium">
                                    DSGVO-konform · Server-Standort Frankfurt (EU)
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AuthGuard>
    )
}
