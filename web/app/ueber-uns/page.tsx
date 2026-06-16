import React from 'react';
import Image from 'next/image';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';
import { Target, Zap, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Über uns | AGENTEQ',
    description: 'Lernen Sie das Team hinter AGENTEQ kennen.',
};

export default function UeberUnsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                {/* Hero Section */}
                <section className="relative overflow-hidden mb-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center mb-16">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance mb-6">
                                Wir bauen das <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Betriebssystem</span> für Immobilienmacher.
                            </h1>
                            <p className="text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto">
                                AGENTEQ verbindet echte Branchen-Expertise mit moderner Künstlicher Intelligenz, um kleine Betriebe zukunftsfähig zu machen.
                            </p>
                        </div>

                        {/* Founder / Portrait Area */}
                        <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">

                            {/* Portrait */}
                            <div className="w-full md:w-1/2 flex justify-center">
                                <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/60">
                                    <Image
                                        src="/profile.png"
                                        alt="Fatih Akdeniz – Gründer & CEO AGENTEQ"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 28rem"
                                        className="object-cover object-[center_15%]"
                                    />
                                </div>
                            </div>

                            {/* Biography Content */}
                            <div className="w-full md:w-1/2 space-y-6">
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Fatih Mehmet Akdeniz
                                </h2>
                                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
                                    Gründer & CEO
                                </p>
                                <div className="prose prose-slate text-slate-600 leading-relaxed">
                                    <p>
                                        [Hier steht der Einführungstext des Gründers. Beschreiben Sie Ihre Motivation, den Hintergrund in der Immobilienbranche oder der Softwareentwicklung und warum AGENTEQ ins Leben gerufen wurde.]
                                    </p>
                                    <p>
                                        [Zweiter Absatz für tiefergehende Philosophie: &quot;Wir glauben daran, dass gute Software sich unsichtbar in den Arbeitsalltag integrieren muss...&quot; - Platzhalter für Ihre persönliche Botschaft.]
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-white border-y border-slate-200/60 py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-balance">
                                Unsere Philosophie
                            </h2>
                            <p className="mt-4 text-lg text-slate-500">
                                Wir arbeiten nach klaren Prinzipien, um das beste Produkt für Sie zu bauen.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
                            {/* Value 1 */}
                            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg text-center flex flex-col items-center">
                                <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                                    <Target size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Aus der Praxis</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    [Platzhalter: Wir bauen Funktionen, die im echten Alltag eines Betriebs fehlen und einen messbaren Mehrwert bieten.]
                                </p>
                            </div>

                            {/* Value 2 */}
                            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg text-center flex flex-col items-center">
                                <div className="h-14 w-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Maximale Einfachheit</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    [Platzhalter: Keine tagelangen Schulungen. Unsere Software muss sich wie von selbst bedienen lassen und Arbeit abnehmen.]
                                </p>
                            </div>

                            {/* Value 3 */}
                            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-lg text-center flex flex-col items-center">
                                <div className="h-14 w-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Deutsches Vertrauen</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    [Platzhalter: Server in Deutschland, DSGVO-konform von Tag 1 und ein Partner, auf den Sie sich verlassen können.]
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
