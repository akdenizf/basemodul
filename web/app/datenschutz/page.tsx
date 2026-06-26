import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Datenschutz | BaseModul',
    description: 'Datenschutzerklärung für die Website basemodul.de – ein Angebot von AGENTEQ.',
};

export default function DatenschutzPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <main className="flex-1 pt-32 pb-24">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 md:p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-8 pb-8 border-b border-slate-100">
                            Datenschutzerklärung
                        </h1>

                        <div className="space-y-10 text-slate-600 leading-relaxed">

                            <section>
                                <p className="text-lg">
                                    Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten beim Besuch unserer Website basemodul.de sowie bei einer Kontaktaufnahme oder Demo-Anfrage. BaseModul ist ein Angebot von AGENTEQ.
                                </p>
                            </section>

                            {/* §1 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 1 Verantwortliche Stelle</h2>
                                <p className="mb-4">
                                    Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
                                </p>
                                <div className="space-y-1 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <p className="font-extrabold text-slate-900">AGENTEQ</p>
                                    <p>Fatih Mehmet Akdeniz</p>
                                    <p>Karl-Marx-Ring 17</p>
                                    <p>81735 München</p>
                                    <p>Deutschland</p>
                                </div>
                                <p className="mt-4">
                                    Kontakt: <a href="mailto:info@agenteq.de" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">info@agenteq.de</a>, Telefon +49&nbsp;15901662235.
                                </p>
                            </section>

                            {/* §2 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 2 Hosting und Server-Logdateien</h2>
                                <p className="mb-3">
                                    Unsere Website wird bei der Vercel Inc. gehostet. Beim Aufruf der Website werden durch den Browser automatisch Informationen an den Server übermittelt und temporär in Server-Logdateien gespeichert. Dies umfasst:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                                    <li>IP-Adresse des anfragenden Rechners</li>
                                    <li>Datum und Uhrzeit des Zugriffs</li>
                                    <li>Name und URL der abgerufenen Datei</li>
                                    <li>Browsertyp und -version sowie das verwendete Betriebssystem</li>
                                    <li>Referrer URL (zuvor besuchte Seite)</li>
                                </ul>
                                <p className="mb-3">
                                    Diese Daten dienen ausschließlich dem reibungslosen Verbindungsaufbau, der Sicherheit und Stabilität des Betriebs. Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse). Die Logdaten werden nach kurzer Zeit, spätestens nach 30 Tagen, gelöscht.
                                </p>
                                <p>
                                    Vercel verarbeitet diese Daten als Auftragsverarbeiter; die Primärdatenhaltung erfolgt in der EU (Frankfurt). Soweit eine Übermittlung in Drittländer erfolgt, geschieht dies auf Grundlage geeigneter Garantien gemäß Art.&nbsp;44&nbsp;ff. DSGVO (z.&nbsp;B. EU-Standardvertragsklauseln).
                                </p>
                            </section>

                            {/* §3 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 3 Kontaktaufnahme und Demo-Anfrage</h2>
                                <p className="mb-3">
                                    Wenn Sie uns per E-Mail, Telefon oder über eine Demo-Anfrage kontaktieren, verarbeiten wir die von Ihnen angegebenen Daten (z.&nbsp;B. Name, Firma, E-Mail-Adresse, Telefonnummer und den Inhalt Ihrer Anfrage), um Ihr Anliegen zu bearbeiten und mit Ihnen zu kommunizieren.
                                </p>
                                <p>
                                    Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (Anbahnung oder Erfüllung eines Vertrags) bzw. Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Die Daten werden gelöscht, sobald sie für den jeweiligen Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                                </p>
                            </section>

                            {/* §4 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 4 Cookies und Tracking</h2>
                                <p className="mb-3">
                                    Diese Website setzt <strong className="text-slate-800">keine nicht notwendigen Cookies</strong> ein. Es findet <strong className="text-slate-800">kein Analyse-, Tracking- oder Marketing-Tracking</strong> statt – insbesondere kein Google Analytics, kein Google Tag Manager, kein Meta-Pixel und keine Werbe-Cookies. Es werden keine Profile gebildet und es findet kein Cross-Site-Tracking statt.
                                </p>
                                <p>
                                    Aus diesem Grund ist auch kein Cookie-Einwilligungsbanner erforderlich. Technisch bedingte Verbindungsdaten werden ausschließlich im Rahmen der Server-Logdateien verarbeitet (siehe §&nbsp;2).
                                </p>
                            </section>

                            {/* §5 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 5 Pilotbetrieb und angebundene Systeme</h2>
                                <p className="mb-3">
                                    Über die öffentliche Website hinaus bietet AGENTEQ mit BaseModul KI-gestützte Module an (z.&nbsp;B. Telefonannahme/Voice, Chat/WhatsApp, Terminbuchung, Foto- und Datei-Übermittlung, Priorisierung). Diese werden ausschließlich nach <strong className="text-slate-800">individueller Einrichtung</strong> im Rahmen eines Pilot- oder Produktivbetriebs bereitgestellt.
                                </p>
                                <p className="mb-3">
                                    Sofern dabei personenbezogene Daten verarbeitet werden, können je nach gewähltem Modul spezialisierte Dienstleister zum Einsatz kommen (etwa für Sprach-/Telefonie, KI-gestützte Textverarbeitung, Nachrichten- oder E-Mail-Versand sowie Datenspeicherung). Eine solche Verarbeitung erfolgt nur auf Grundlage eines <strong className="text-slate-800">Auftragsverarbeitungsvertrags (AVV) gemäß Art.&nbsp;28 DSGVO</strong> mit dem jeweiligen Kunden; der Kunde bleibt datenschutzrechtlich Verantwortlicher für die Daten seiner Endkunden.
                                </p>
                                <p>
                                    Auf dieser Website bzw. der öffentlichen Landingpage findet keine derartige Verarbeitung statt. Die konkret eingesetzten Dienste und Garantien werden im Rahmen der jeweiligen Einrichtung gesondert dokumentiert.
                                </p>
                            </section>

                            {/* §6 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 6 Ihre Rechte</h2>
                                <p className="mb-3">
                                    Sie haben hinsichtlich der Sie betreffenden personenbezogenen Daten folgende Rechte:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                                    <li>Recht auf Auskunft (Art.&nbsp;15 DSGVO)</li>
                                    <li>Recht auf Berichtigung (Art.&nbsp;16 DSGVO)</li>
                                    <li>Recht auf Löschung (Art.&nbsp;17 DSGVO)</li>
                                    <li>Recht auf Einschränkung der Verarbeitung (Art.&nbsp;18 DSGVO)</li>
                                    <li>Recht auf Datenübertragbarkeit (Art.&nbsp;20 DSGVO)</li>
                                    <li>Recht auf Widerspruch gegen die Verarbeitung (Art.&nbsp;21 DSGVO)</li>
                                </ul>
                                <p>
                                    Darüber hinaus steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Die für uns zuständige Aufsichtsbehörde ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.
                                </p>
                            </section>

                            {/* §7 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 7 SSL/TLS-Verschlüsselung</h2>
                                <p>
                                    Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und am Schloss-Symbol in der Browserzeile.
                                </p>
                            </section>

                            {/* §8 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 8 Änderungen dieser Datenschutzerklärung</h2>
                                <p className="mb-3">
                                    Wir passen diese Datenschutzerklärung an, sobald Änderungen unserer Leistungen oder der rechtlichen Rahmenbedingungen dies erfordern. Für Ihren erneuten Besuch gilt dann jeweils die aktuelle Fassung.
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
