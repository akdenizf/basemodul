import React from 'react';
import Image from 'next/image';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Kontakt | AGENTEQ',
    description: 'Nehmen Sie Kontakt mit uns auf oder buchen Sie direkt eine kostenlose Demo.',
};

const CAL_LINK = 'https://app.cal.eu/agenteq/30min?user=agenteq&overlayCalendar=true';

export default function KontaktPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            <main className="flex-1 pt-28 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mb-5">
                            Wir freuen uns von Ihnen zu hören
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl text-balance mb-5">
                            Kontakt
                        </h1>
                        <p className="text-lg leading-relaxed text-slate-500">
                            Buchen Sie direkt eine kostenlose Demo oder schreiben Sie uns –
                            wir antworten persönlich.
                        </p>
                    </div>

                    <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">

                        {/* Demo buchen – primary CTA */}
                        <a
                            href={CAL_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-emerald-400 hover:shadow-md flex flex-col gap-5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Calendar size={22} strokeWidth={1.8} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                                    Kostenlose Demo buchen
                                </h2>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    30 Minuten. Kein Verkaufsdruck. Wir schauen gemeinsam, wo Anfragen hängen bleiben und ob ein Pilot Sinn ergibt.
                                </p>
                            </div>
                            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                                Termin wählen →
                            </span>
                        </a>

                        {/* E-Mail */}
                        <a
                            href="mailto:info@agenteq.de"
                            className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md flex flex-col gap-5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                                <Mail size={22} strokeWidth={1.8} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors mb-1">
                                    E-Mail
                                </h2>
                                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                                    Allgemeine Anfragen, Partnerschaftsanfragen oder Feedback –
                                    wir melden uns innerhalb von 24 Stunden.
                                </p>
                                <span className="text-sm font-semibold text-slate-900">info@agenteq.de</span>
                            </div>
                        </a>

                        {/* Telefon */}
                        <a
                            href="tel:+4915901662235"
                            className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md flex flex-col gap-5"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                                <Phone size={22} strokeWidth={1.8} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors mb-1">
                                    Telefon
                                </h2>
                                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                                    Mo–Fr, 9–18 Uhr. Sprechen Sie direkt mit dem Gründerteam.
                                </p>
                                <span className="text-sm font-semibold text-slate-900">+49 159 0166 2235</span>
                            </div>
                        </a>

                        {/* Adresse */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col gap-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                                <MapPin size={22} strokeWidth={1.8} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-1">Standort</h2>
                                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                                    Unser Büro befindet sich in München – besuchen Sie uns nach Vereinbarung.
                                </p>
                                <address className="not-italic text-sm font-semibold text-slate-900 leading-relaxed">
                                    AGENTEQ<br />
                                    Karl-Marx-Ring 17<br />
                                    81735 München
                                </address>
                            </div>
                        </div>
                    </div>

                    {/* Founder note */}
                    <div className="mx-auto max-w-4xl mt-10">
                        <div className="rounded-2xl bg-slate-900 p-8 md:p-10 flex flex-col sm:flex-row items-center gap-6 text-white">
                            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 ring-4 ring-white/10">
                                <Image
                                    src="/profile.png"
                                    alt="Fatih Akdeniz"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover object-[center_15%]"
                                />
                            </div>
                            <div>
                                <p className="text-slate-300 leading-relaxed text-sm mb-3 italic">
                                    &ldquo;Wir schauen uns Ihren Anfragefluss an und prüfen, ob AGENTEQ Ihnen im Alltag wirklich Arbeit abnehmen kann.
                                    Buchen Sie einfach einen Termin - ich freue mich auf das Gespräch.&rdquo;
                                </p>
                                <p className="font-bold text-white text-sm">Fatih Akdeniz</p>
                                <p className="text-slate-400 text-xs">Gründer & CEO, AGENTEQ</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
