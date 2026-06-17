import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Impressum | AGENTEQ',
    description: 'Impressum des AGENTEQ Anfrage-Assistenten.',
};

export default function ImpressumPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <main className="flex-1 pt-32 pb-24">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 md:p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
                            Impressum
                        </h1>
                        <p className="text-sm font-medium text-slate-400 mb-10 pb-8 border-b border-slate-100">
                            Angaben gemäß § 5 DDG
                        </p>

                        <div className="space-y-10 text-slate-600 leading-relaxed">
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Anbieter</h2>
                                <p className="mb-4">AGENTEQ ist ein Service von:</p>
                                <div className="space-y-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="font-extrabold text-slate-900">AGENTEQ</p>
                                    <p>Fatih Mehmet Akdeniz</p>
                                    <p className="text-sm text-slate-500 mb-2">Einzelunternehmer</p>
                                    <p>Karl-Marx-Ring 17</p>
                                    <p>81735 München</p>
                                    <p>Deutschland</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Kontakt</h2>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900 w-20">Telefon:</span>
                                        +49 15901662235
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900 w-20">E-Mail:</span>
                                        <a href="mailto:info@agenteq.de" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">info@agenteq.de</a>
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Umsatzsteuer-Identifikationsnummer</h2>
                                <p>
                                    Gemäß § 27 a Umsatzsteuergesetz: <strong className="text-slate-900">DE361102953</strong>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Verantwortlich für den Inhalt</h2>
                                <p className="mb-4">
                                    Nach § 18 Abs. 2 MStV (Medienstaatsvertrag):
                                </p>
                                <div className="space-y-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="font-semibold text-slate-900">Fatih Mehmet Akdeniz</p>
                                    <p>Karl-Marx-Ring 17</p>
                                    <p>81735 München</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
