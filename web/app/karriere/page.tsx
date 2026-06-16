'use client';

import React, { useState } from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
    Clock,
    Code2,
    Users,
    Zap,
    MapPin,
    Timer,
    ChevronDown,
    CheckCircle2,
    Circle,
    ArrowLeft,
    Mail,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
    {
        icon: Clock,
        title: 'Flexible Arbeitszeiten',
        desc: 'Remote oder in unserem Büro in München – du entscheidest.',
    },
    {
        icon: Code2,
        title: 'Modernster Tech-Stack',
        desc: 'Next.js, Tailwind, Vapi und OpenAI – du arbeitest mit den besten Tools.',
    },
    {
        icon: Users,
        title: 'Founding-Team-Spirit',
        desc: 'Flache Hierarchien und direkte Zusammenarbeit mit dem Gründer.',
    },
    {
        icon: Zap,
        title: 'Echter Impact',
        desc: 'Deine Arbeit automatisiert Millionen von Minuten Verwaltungsaufwand.',
    },
];

type Job = {
    id: string;
    title: string;
    type: string;
    location: string;
    department: string;
    mission: string;
    tasks: string[];
    requirements: string[];
    niceToHave: string[];
    offer: string[];
};

const jobs: Job[] = [
    {
        id: 'fullstack-dev',
        title: 'Founding Fullstack Developer (m/w/d)',
        type: 'Vollzeit',
        location: 'Remote oder München',
        department: 'Engineering',
        mission:
            'Du baust gemeinsam mit dem Gründer das technische Fundament von AGENTEQ. Als erste Entwicklerin / erster Entwickler im Team prägst du die Architektur, wählst Tools mit aus und sorgst dafür, dass unsere Voice-AI-Plattform skaliert.',
        tasks: [
            'Weiterentwicklung der SaaS-Plattform für KI-Telefonassistenten in der Immobilienbranche',
            'Integration und Verbesserung unserer Voice-Agents (Vapi / OpenAI)',
            'Mitgestaltung der technischen Architektur und Produktstrategie',
            'Enge Zusammenarbeit mit dem Gründerteam – deine Meinung zählt',
            'Anbindung externer Systeme und APIs (CRMs, Branchensoftware)',
        ],
        requirements: [
            'Solide Erfahrung als Fullstack Developer (React / Next.js + Node.js / TypeScript)',
            'Gute SQL-Kenntnisse (Postgres / Supabase von Vorteil)',
            'Leidenschaft für AI und neue Technologien',
            'Eigenverantwortliche, strukturierte Arbeitsweise',
            'Fließende Deutsch- und gute Englischkenntnisse',
        ],
        niceToHave: [
            'Erfahrung mit Voice-AI oder Echtzeit-Kommunikation (WebRTC, Vapi)',
            'Kenntnisse in der Immobilien- oder PropTech-Branche',
            'Erfahrung mit CI/CD und Cloud-Deployments (Vercel, AWS)',
        ],
        offer: [
            'Direkte Mitgestaltung des Produkts und der Unternehmensstrategie',
            'Modernste Ausstattung (MacBook, AI-Coding-Tools wie Cursor / Claude Code)',
            'Flexible Arbeitszeiten, Remote oder München',
            'Attraktives Gehalt + Beteiligungsoption',
            'Startup-Dynamik mit echter Verantwortung von Tag 1',
        ],
    },
    {
        id: 'sales-manager',
        title: 'Sales Manager / Account Executive (m/w/d)',
        type: 'Vollzeit',
        location: 'Remote oder München',
        department: 'Sales',
        mission:
            'Du bist die erste Stimme von AGENTEQ nach außen. Du überzeugst kleine Betriebe, warum KI-Telefonie ihr Alltagsgeschäft revolutioniert – und du schließt Deals ab, die das Unternehmen wachsen lassen.',
        tasks: [
            'Eigenständige Akquise und Betreuung von kleine Betriebe als Neukunden',
            'Durchführung von Produktdemos (live und remote)',
            'Aufbau langfristiger Kundenbeziehungen und Expansion bestehender Accounts',
            'Enge Abstimmung mit dem Gründer zu Pricing, Positionierung und Produktfeedback',
            'Mitaufbau von Sales-Prozessen, Pitch-Decks und CRM-Strukturen',
        ],
        requirements: [
            'Erfahrung im B2B-Vertrieb, idealerweise SaaS oder PropTech',
            'Ausgeprägte Kommunikations- und Überzeugungsfähigkeit',
            'Strukturiertes, zielorientiertes Arbeiten',
            'Fließende Deutschkenntnisse (C2), gute Englischkenntnisse',
            'Eigeninitiative und Hunter-Mentalität',
        ],
        niceToHave: [
            'Kenntnisse in der Immobilienverwaltungsbranche',
            'Erfahrung mit HubSpot, Pipedrive oder ähnlichen CRMs',
            'Eigenes Netzwerk in der PropTech- oder Real-Estate-Branche',
        ],
        offer: [
            'Attraktives Fixum + leistungsbasierte Provision ohne Deckelung',
            'Direkter Einfluss auf Produktrichtung und Positionierung',
            'Flexible Arbeitszeiten, Remote oder München',
            'Startup-Atmosphäre mit flachen Hierarchien',
            'Beteiligungsoption nach erfolgreichem Onboarding',
        ],
    },
    {
        id: 'werkstudent-sales',
        title: 'Werkstudent Sales (m/w/d)',
        type: '20 Std./Woche',
        location: 'München oder Remote',
        department: 'Sales',
        mission:
            'Du unterstützt unser Sales-Team im Tagesgeschäft und lernst, wie moderner B2B-SaaS-Vertrieb funktioniert – direkt neben dem Gründer, ohne Bürokratie.',
        tasks: [
            'Recherche und Qualifizierung potenzieller Kunden (kleine Betriebe)',
            'Unterstützung bei der Erstellung von Outreach-Materialien und Sequenzen',
            'Pflege des CRMs und Tracking von Sales-Aktivitäten',
            'Vorbereitung und Nachbereitung von Demos',
            'Analyse von Markt- und Wettbewerbsdaten',
        ],
        requirements: [
            'Eingeschriebene/r Student/in (BWL, Kommunikation, Wirtschaftsinformatik o.Ä.)',
            'Kommunikationsstärke und Interesse an B2B-Sales',
            'Strukturierte, selbstständige Arbeitsweise',
            'Fließende Deutschkenntnisse',
        ],
        niceToHave: [
            'Erste Erfahrungen im Sales oder Marketing',
            'Interesse an AI, PropTech oder SaaS',
        ],
        offer: [
            'Direktes Arbeiten neben dem Gründer – steile Lernkurve garantiert',
            'Flexibles Arbeiten: Remote oder München',
            'Möglichkeit zur Übernahme bei starker Performance',
            'Einblick in den kompletten Aufbau eines AI-Startups',
        ],
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckItem({ text, muted = false }: { text: string; muted?: boolean }) {
    const Icon = muted ? Circle : CheckCircle2;
    return (
        <li className="flex items-start gap-3">
            <Icon
                size={18}
                className={`mt-0.5 shrink-0 ${muted ? 'text-slate-300' : 'text-emerald-500'}`}
                strokeWidth={1.8}
            />
            <span className={muted ? 'text-slate-400' : 'text-slate-600'}>{text}</span>
        </li>
    );
}

function JobDetail({ job, onBack }: { job: Job; onBack: () => void }) {
    const subject = encodeURIComponent(`Bewerbung als ${job.title} - [Dein Name]`);
    const mailtoHref = `mailto:karriere@agenteq.de?subject=${subject}`;

    return (
        <div className="mx-auto max-w-3xl">
            {/* Back */}
            <button
                onClick={onBack}
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
                <ArrowLeft size={16} />
                Zurück zu allen Stellen
            </button>

            {/* Header */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-8">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Timer size={14} /> {job.type}</span>
                <span className="flex items-center gap-1.5"><Code2 size={14} /> {job.department}</span>
            </div>

            <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg mb-12"
            >
                <Mail size={16} />
                Jetzt bewerben
            </a>

            {/* Content */}
            <div className="space-y-10">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">Die Position</h2>
                    <p className="text-slate-600 leading-relaxed">{job.mission}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Deine Aufgaben</h2>
                    <ul className="space-y-3">
                        {job.tasks.map((t) => <CheckItem key={t} text={t} />)}
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Das bringst du mit</h2>
                    <ul className="space-y-3">
                        {job.requirements.map((r) => <CheckItem key={r} text={r} />)}
                    </ul>
                </section>

                {job.niceToHave.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Nice to have</h2>
                        <ul className="space-y-3">
                            {job.niceToHave.map((n) => <CheckItem key={n} text={n} muted />)}
                        </ul>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Das bieten wir dir</h2>
                    <ul className="space-y-3">
                        {job.offer.map((o) => <CheckItem key={o} text={o} />)}
                    </ul>
                </section>

                {/* CTA card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Interesse geweckt?</h3>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                        Schick uns deinen Lebenslauf und ein kurzes Anschreiben an{' '}
                        <a href="mailto:karriere@agenteq.de" className="text-emerald-600 font-medium hover:underline">
                            karriere@agenteq.de
                        </a>
                    </p>
                    <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg"
                    >
                        <Mail size={16} />
                        Jetzt bewerben
                    </a>
                </div>

            </div>
        </div>
    );
}

function JobListItem({ job, onSelect }: { job: Job; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className="group w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md hover:bg-emerald-50/30"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {job.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                        <span className="flex items-center gap-1"><Timer size={11} /> {job.type}</span>
                    </div>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all duration-200 group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white">
                    <ChevronDown size={16} className="-rotate-90" />
                </div>
            </div>
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KarrierePage() {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            <main className="flex-1 pt-28 pb-24">
                {selectedJob ? (
                    /* ── Job Detail View ── */
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <JobDetail job={selectedJob} onBack={() => setSelectedJob(null)} />
                    </div>
                ) : (
                    /* ── Job List View ── */
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">

                        {/* Hero */}
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mb-5">
                                Karriere bei AGENTEQ
                            </span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl text-balance mb-5">
                                Werde Teil der{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                    AGENTEQ-Vision
                                </span>
                            </h1>
                            <p className="text-lg leading-relaxed text-slate-500">
                                Wir entlasten kleine Betriebe mit einem Anfrage-Assistenten.
                                Gestalte mit uns die Zukunft der Immobilienbranche.
                            </p>
                        </div>

                        {/* Benefits grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                            {benefits.map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <Icon size={22} strokeWidth={1.8} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1 text-sm">{title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Job list */}
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">
                                Offene Positionen
                            </h2>
                            <div className="space-y-3 mb-12">
                                {jobs.map((job) => (
                                    <JobListItem
                                        key={job.id}
                                        job={job}
                                        onSelect={() => setSelectedJob(job)}
                                    />
                                ))}
                            </div>

                            {/* Initiativ CTA */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Interesse geweckt?</h3>
                                <p className="text-slate-500 text-sm mb-6">
                                    Keine passende Stelle dabei? Wir freuen uns auf deine Initiativbewerbung.
                                </p>
                                <a
                                    href="mailto:karriere@agenteq.de?subject=Initiativbewerbung - [Dein Name]"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-slate-800 hover:shadow-lg"
                                >
                                    <Mail size={16} />
                                    Initiativ bewerben
                                </a>
                            </div>

                            {/* Footer note */}
                            <p className="mt-10 text-center text-sm text-slate-400 italic">
                                Ich freue mich darauf, mit dir gemeinsam etwas Großes aufzubauen! – Fatih
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
