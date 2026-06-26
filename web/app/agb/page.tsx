import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AGB | BaseModul',
    description: 'Pilot- und Leistungsbedingungen für BaseModul (B2B) – ein Angebot von AGENTEQ.',
};

export default function AgbPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <main className="flex-1 pt-32 pb-24">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 md:p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-8 pb-8 border-b border-slate-100">
                            Pilot- und Leistungsbedingungen
                        </h1>

                        <div className="space-y-10 text-slate-600 leading-relaxed">

                            <section>
                                <p className="text-lg">
                                    Diese Bedingungen regeln das Vertragsverhältnis zwischen AGENTEQ, Fatih Mehmet Akdeniz, Karl-Marx-Ring 17, 81735 München (nachfolgend &quot;AGENTEQ&quot; oder &quot;Anbieter&quot;) und dem Kunden über die Einrichtung und Bereitstellung der BaseModul-Module. BaseModul ist ein Angebot von AGENTEQ. Maßgeblich für den konkreten Leistungsumfang ist stets das jeweilige individuelle Angebot.
                                </p>
                            </section>

                            {/* §1 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 1 Geltungsbereich und Vertragspartner</h2>
                                <p className="mb-3">
                                    (1) Diese Bedingungen gelten ausschließlich für Unternehmer im Sinne des § 14 BGB, die die Leistungen im Rahmen ihrer gewerblichen oder selbständigen beruflichen Tätigkeit nutzen. Das Angebot richtet sich nicht an Verbraucher im Sinne des § 13 BGB.
                                </p>
                                <p>
                                    (2) Abweichende, entgegenstehende oder ergänzende Geschäftsbedingungen des Kunden werden nur dann Vertragsbestandteil, wenn der Anbieter ihrer Geltung ausdrücklich in Textform zugestimmt hat.
                                </p>
                            </section>

                            {/* §2 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 2 Vertragsgegenstand und Leistungen</h2>
                                <p className="mb-3">
                                    (1) AGENTEQ stellt mit BaseModul modulare, KI-gestützte Assistenz-Module bereit. Dazu zählen je nach Vereinbarung insbesondere die Telefonannahme und Vorqualifizierung von Anliegen sowie ergänzende Module für Termine, Chat/WhatsApp, Foto- und Datei-Übermittlung und Priorisierung.
                                </p>
                                <p className="mb-3">
                                    (2) Der konkrete Funktions- und Leistungsumfang, die Einrichtung sowie etwaige Anbindungen an Systeme des Kunden ergeben sich aus dem individuellen Angebot. Bildliche oder textliche Darstellungen auf der Website dienen der Veranschaulichung und stellen keine zugesicherten Eigenschaften dar.
                                </p>
                                <p>
                                    (3) Die Module sind <strong className="text-slate-800">technische Assistenzsysteme</strong> zur Ersterfassung und Vorqualifizierung von Anliegen. Sie ersetzen keine menschliche Prüfung oder Entscheidung. Ein bestimmter Automatisierungsgrad oder eine vollständige bzw. lückenlose Erfassung aller Anliegen wird nicht geschuldet.
                                </p>
                            </section>

                            {/* §3 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 3 Einrichtung, Pilotbetrieb und Mitwirkung des Kunden</h2>
                                <p className="mb-3">
                                    (1) Die Einrichtung erfolgt individuell und kann als zeitlich befristeter Pilotbetrieb vereinbart werden. Inhalt, Dauer und Ziele eines Pilotbetriebs ergeben sich aus dem individuellen Angebot.
                                </p>
                                <p className="mb-3">
                                    (2) Der Kunde stellt die für Einrichtung und Betrieb erforderlichen Informationen und Zugänge bereit und ist für deren Richtigkeit und Aktualität verantwortlich. Eine fehlerhafte oder unvollständige Datenbasis kann die Qualität der Ergebnisse beeinträchtigen.
                                </p>
                                <p>
                                    (3) Der Kunde prüft die durch die Module erzeugten Ergebnisse eigenständig und bleibt für die Bearbeitung der Anliegen verantwortlich. Als dringend oder als Notfall eingestufte Meldungen sind vom Kunden <strong className="text-slate-800">unverzüglich menschlich zu überprüfen</strong> und gegebenenfalls geeignete Maßnahmen einzuleiten.
                                </p>
                            </section>

                            {/* §4 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 4 Vergütung</h2>
                                <p className="mb-3">
                                    (1) Die Vergütung sowie Leistungen, Fälligkeit und Abrechnungsmodalitäten richten sich nach dem individuellen Angebot.
                                </p>
                                <p>
                                    (2) Alle Preise verstehen sich als Nettopreise zuzüglich der jeweils geltenden gesetzlichen Umsatzsteuer.
                                </p>
                            </section>

                            {/* §5 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 5 Haftung</h2>
                                <p className="mb-3">
                                    (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für vorsätzlich oder grob fahrlässig verursachte Schäden.
                                </p>
                                <p className="mb-3">
                                    (2) Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und in diesen Fällen begrenzt auf den vertragstypischen, vorhersehbaren Schaden.
                                </p>
                                <p className="mb-3">
                                    (3) Da die Module technische Hilfsmittel zur Ersterfassung sind, übernimmt der Anbieter insbesondere keine Gewähr für:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                                    <li>die inhaltliche Richtigkeit, Vollständigkeit oder Korrektheit KI-generierter Zusammenfassungen, Kategorisierungen oder Dringlichkeitsbewertungen;</li>
                                    <li>die lückenlose und fehlerfreie Erkennung aller Anliegen, insbesondere von Notfällen oder sicherheitskritischen Situationen;</li>
                                    <li>Schäden, die daraus entstehen, dass der Kunde auf eine eigenständige Überprüfung und Bearbeitung der Ergebnisse verzichtet.</li>
                                </ul>
                                <p>
                                    (4) Die finale Verantwortung für die rechtzeitige und sachgerechte Bearbeitung der Anliegen verbleibt ausschließlich beim Kunden.
                                </p>
                            </section>

                            {/* §6 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 6 Datenschutz und Auftragsverarbeitung</h2>
                                <p className="mb-3">
                                    (1) Einzelheiten zur Verarbeitung personenbezogener Daten sind in unserer <a href="/datenschutz" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Datenschutzerklärung</a> geregelt.
                                </p>
                                <p>
                                    (2) Sofern der Anbieter im Rahmen eines Pilot- oder Produktivbetriebs personenbezogene Daten von Endkunden im Auftrag des Kunden verarbeitet, wird vor Beginn der Verarbeitung ein Vertrag zur Auftragsverarbeitung (AVV) gemäß Art.&nbsp;28 DSGVO geschlossen. Der Kunde bleibt insoweit datenschutzrechtlich Verantwortlicher.
                                </p>
                            </section>

                            {/* §7 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 7 Laufzeit und Beendigung</h2>
                                <p className="mb-3">
                                    (1) Laufzeit und Kündigungsfristen richten sich nach dem individuellen Angebot. Ein Pilotbetrieb kann befristet vereinbart werden und endet mit Ablauf der vereinbarten Dauer, sofern nichts anderes vereinbart ist.
                                </p>
                                <p className="mb-3">
                                    (2) Kündigungen und Beendigungserklärungen bedürfen der Textform (E-Mail ist ausreichend).
                                </p>
                                <p>
                                    (3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt für beide Parteien unberührt.
                                </p>
                            </section>

                            {/* §8 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 8 Schlussbestimmungen</h2>
                                <p className="mb-3">
                                    (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).
                                </p>
                                <p className="mb-3">
                                    (2) Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist München, sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
                                </p>
                                <p className="mb-3">
                                    (3) Sollten einzelne Bestimmungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                                </p>
                                <p className="mb-3">
                                    (4) Änderungen und Ergänzungen dieser Bedingungen bedürfen der Textform.
                                </p>
                                <p className="text-sm text-slate-500 mt-6">
                                    Stand: Juni 2026
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
