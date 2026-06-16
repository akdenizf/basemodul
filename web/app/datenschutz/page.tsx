import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Datenschutz | AGENTEQ',
    description: 'Datenschutzerklärung der AGENTEQ KI-Telefonzentrale.',
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
                                    Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, BDSG, TMG). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer SaaS-Plattform &quot;AGENTEQ&quot;.
                                </p>
                            </section>

                            {/* §1 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 1 Verantwortliche Stelle</h2>
                                <p className="mb-4">
                                    Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
                                </p>
                                <div className="space-y-1 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <p className="font-extrabold text-slate-900">AGENTEQ</p>
                                    <p>Fatih Mehmet Akdeniz</p>
                                    <p>Karl-Marx-Ring 17</p>
                                    <p>81735 München</p>
                                    <p>Deutschland</p>
                                </div>
                                <p className="mt-4">
                                    Sofern AGENTEQ personenbezogene Daten im Auftrag eines Kunden verarbeitet (z.&nbsp;B. Endkundendaten im Rahmen der Ticketerstellung), handeln wir als Auftragsverarbeiter gemäß Art.&nbsp;28 DSGVO. In diesem Fall ist der jeweilige Kunde der datenschutzrechtlich Verantwortliche.
                                </p>
                            </section>

                            {/* §2 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 2 Erhebung und Speicherung personenbezogener Daten</h2>
                                <p className="mb-3">
                                    Beim Besuch unserer Website werden durch den Browser automatisch Informationen an unseren Server gesendet und temporär in Server-Log-Dateien gespeichert. Dies umfasst:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                                    <li>IP-Adresse des anfragenden Rechners</li>
                                    <li>Datum und Uhrzeit des Zugriffs</li>
                                    <li>Name und URL der abgerufenen Datei</li>
                                    <li>Übertragene Datenmenge</li>
                                    <li>Browsertyp und -version</li>
                                    <li>Verwendetes Betriebssystem</li>
                                    <li>Referrer URL (zuvor besuchte Seite)</li>
                                </ul>
                                <p>
                                    Diese Daten werden ausschließlich zur Sicherstellung eines reibungslosen Verbindungsaufbaus, der komfortablen Nutzung unserer Website sowie zur Auswertung der Systemsicherheit erhoben. Die Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse). Die Log-Dateien werden nach 30 Tagen automatisch gelöscht.
                                </p>
                            </section>

                            {/* §3 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 3 Ihre Rechte</h2>
                                <p className="mb-3">
                                    Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
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

                            {/* §4 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 4 Cookies und Session-Verwaltung</h2>
                                <p className="mb-3">
                                    Unsere Plattform setzt ausschließlich technisch notwendige Cookies ein. Diese sind für den sicheren Betrieb der Anwendung erforderlich und können nicht deaktiviert werden. Im Einzelnen verwenden wir:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                                    <li><strong className="text-slate-800">Authentifizierungs-Cookie (Supabase Auth):</strong> Speichert Ihre Sitzungsdaten nach dem Login, damit Sie sich nicht bei jedem Seitenaufruf erneut anmelden müssen. Wird nach Ende der Sitzung gelöscht.</li>
                                    <li><strong className="text-slate-800">Theme-Präferenz:</strong> Speichert Ihre Einstellung für den Hell-/Dunkelmodus der Benutzeroberfläche (localStorage).</li>
                                </ul>
                                <p>
                                    Wir setzen keine Tracking-Cookies, Analyse-Cookies oder Marketing-Cookies ein. Es findet kein Cross-Site-Tracking statt.
                                </p>
                            </section>

                            {/* §5 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 5 Nutzung von KI-Diensten und Drittanbietern</h2>
                                <p className="mb-4">
                                    Für die Erbringung unserer Dienstleistungen setzen wir KI-basierte Technologien und spezialisierte Dienstleister ein. Nachfolgend informieren wir Sie transparent über jeden einzelnen Dienst:
                                </p>

                                <h3 className="text-base font-semibold text-slate-800 mb-2">Vapi Inc. (Voice AI – Anrufverarbeitung)</h3>
                                <p className="mb-4">
                                    Über Vapi wird die automatisierte Anrufentgegennahme und Sprachverarbeitung realisiert. Eingehende Anrufe werden in Echtzeit transkribiert und in strukturierte Ticketdaten überführt. Die Audiodaten werden ausschließlich für die Dauer der Verarbeitung im Arbeitsspeicher gehalten und <strong className="text-slate-800">nicht dauerhaft als Audiodateien gespeichert</strong>. Es werden keine Gesprächsaufzeichnungen archiviert. Rechtsgrundlage: Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (Vertragserfüllung) bzw. Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse des Verantwortlichen).
                                </p>

                                <h3 className="text-base font-semibold text-slate-800 mb-2">OpenAI (KI-gestützte Textanalyse)</h3>
                                <p className="mb-4">
                                    Zur Analyse und Zusammenfassung von Schadensmeldungen nutzen wir die Schnittstelle von OpenAI. Es werden ausschließlich die vom Sprachassistenten erzeugten Textdaten (Zusammenfassungen, Kategorisierungen) verarbeitet – <strong className="text-slate-800">keine Audiodateien und keine Rohdaten der Anrufe</strong>. OpenAI verarbeitet Daten im Auftrag und verwendet diese nicht zum Training eigener Modelle (API-Nutzungsbedingungen mit Opt-out).
                                </p>

                                <h3 className="text-base font-semibold text-slate-800 mb-2">Twilio Inc. (SMS-Versand)</h3>
                                <p className="mb-4">
                                    Für den Versand von SMS-Nachrichten im Rahmen unserer &quot;Visual Context&quot;-Funktion (Foto-Upload-Anforderung an Endkunden) nutzen wir den Dienst Twilio. Dabei werden die Mobilfunknummer des Empfängers sowie der Nachrichteninhalt an Twilio übermittelt. Twilio verarbeitet Daten gemäß eigener Datenschutzbestimmungen und dem mit uns geschlossenen Auftragsverarbeitungsvertrag.
                                </p>

                                <h3 className="text-base font-semibold text-slate-800 mb-2">Resend Inc. (E-Mail-Versand)</h3>
                                <p className="mb-4">
                                    Für den Versand transaktionaler E-Mails (Ticket-Benachrichtigungen, Handwerkerbeauftragungen) verwenden wir den Dienst Resend. Dabei werden E-Mail-Adressen und Nachrichteninhalte verarbeitet. Ein Auftragsverarbeitungsvertrag gemäß Art.&nbsp;28 DSGVO ist abgeschlossen.
                                </p>

                                <h3 className="text-base font-semibold text-slate-800 mb-2">Supabase Inc. (Datenbank und Authentifizierung)</h3>
                                <p className="mb-3">
                                    Unsere Datenbank- und Authentifizierungsinfrastruktur wird über Supabase bereitgestellt. Sämtliche Daten werden auf Servern in <strong className="text-slate-800">Frankfurt am Main, Deutschland (EU)</strong> gespeichert. Der Datenbankzugriff erfolgt ausschließlich verschlüsselt über SSL/TLS. Ein Auftragsverarbeitungsvertrag gemäß Art.&nbsp;28 DSGVO ist abgeschlossen.
                                </p>
                            </section>

                            {/* §6 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 6 Datenweitergabe und Hosting</h2>
                                <p className="mb-3">
                                    Unsere Website und Anwendung wird über Vercel Inc. gehostet. Vercel betreibt ein globales Edge-Netzwerk, wobei die Primärdatenhaltung in der EU (Frankfurt) erfolgt. Vercel verarbeitet Server-Log-Daten im Rahmen berechtigter Interessen gemäß Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.
                                </p>
                                <p className="mb-3">
                                    Eine Übermittlung personenbezogener Daten an Drittländer außerhalb der EU/EWR findet nur statt, wenn angemessene Garantien gemäß Art.&nbsp;46 DSGVO vorliegen (EU-Standardvertragsklauseln) oder ein Angemessenheitsbeschluss der EU-Kommission existiert (z.&nbsp;B. EU-U.S. Data Privacy Framework).
                                </p>
                                <p>
                                    Wir geben Ihre Daten nur dann an Dritte weiter, wenn dies zur Erfüllung des Vertragszwecks erforderlich ist, Sie ausdrücklich eingewilligt haben oder eine gesetzliche Verpflichtung besteht.
                                </p>
                            </section>

                            {/* §7 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 7 Auftragsverarbeitung (AVV)</h2>
                                <p className="mb-3">
                                    AGENTEQ agiert gegenüber seinen Kunden als Auftragsverarbeiter im Sinne des Art.&nbsp;28 DSGVO. Der Kunde bleibt als Verantwortlicher für die Verarbeitung der Endkundendaten zuständig. AGENTEQ verarbeitet personenbezogene Daten der Endkunden (Namen, Adressen, Telefonnummern, Schadensbeschreibungen) ausschließlich im Auftrag und nach dokumentierter Weisung des Kunden.
                                </p>
                                <p>
                                    Ein Vertrag zur Auftragsverarbeitung (AVV) wird mit jedem Kunden vor Beginn der Datenverarbeitung abgeschlossen. Dieser regelt insbesondere den Gegenstand und die Dauer der Verarbeitung, Art und Zweck der Verarbeitung, die Art der personenbezogenen Daten, die Kategorien betroffener Personen sowie die Rechte und Pflichten beider Parteien.
                                </p>
                            </section>

                            {/* §8 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 8 Verarbeitung von Audiodaten</h2>
                                <p className="mb-3">
                                    Im Rahmen der KI-gestützten Telefonzentrale werden eingehende Anrufe automatisiert entgegengenommen und verarbeitet. Dabei gilt:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                                    <li>Anrufer werden zu Beginn des Gesprächs darauf hingewiesen, dass sie mit einem digitalen KI-Assistenten sprechen (Transparenzpflicht gemäß EU AI Act).</li>
                                    <li>Die Sprachdaten werden in Echtzeit transkribiert und in strukturierte Textdaten (Ticketdaten) umgewandelt.</li>
                                    <li><strong className="text-slate-800">Es werden keine dauerhaften Audioaufzeichnungen gespeichert.</strong> Nach der Echtzeitverarbeitung werden die Audiodaten unverzüglich gelöscht.</li>
                                    <li>Die resultierenden Ticketdaten (Zusammenfassung, Kategorie, Dringlichkeit) werden in der Datenbank gespeichert und dem Kunden zur Verfügung gestellt.</li>
                                </ul>
                                <p>
                                    Die Rechtsgrundlage für die Verarbeitung ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (Erfüllung des Vertrags zwischen dem Kunden und AGENTEQ) in Verbindung mit der Auftragsverarbeitungsvereinbarung.
                                </p>
                            </section>

                            {/* §9 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 9 Kontaktaufnahme und Kommunikation</h2>
                                <p className="mb-3">
                                    Wenn Endkunden über die AGENTEQ-Telefonzentrale Kontakt aufnehmen, werden folgende Daten verarbeitet: Telefonnummer (automatische Anruferkennung), Name und Adresse (soweit vom Anrufer genannt), Beschreibung des Anliegens sowie die automatisierte Zusammenfassung.
                                </p>
                                <p>
                                    Sofern Endkunden im Rahmen der &quot;Visual Context&quot;-Funktion per SMS aufgefordert werden, Fotos hochzuladen, werden deren Mobilfunknummer und die hochgeladenen Bilddateien verarbeitet. Die Fotos werden in einem sicheren Cloud-Speicher (Supabase Storage, Server Frankfurt) abgelegt und ausschließlich dem zugehörigen Ticket zugeordnet.
                                </p>
                            </section>

                            {/* §10 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 10 Speicherdauer und Löschung</h2>
                                <p className="mb-3">
                                    Wir speichern personenbezogene Daten nur so lange, wie dies für die Erfüllung des Vertragszwecks oder aufgrund gesetzlicher Aufbewahrungsfristen erforderlich ist:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                                    <li><strong className="text-slate-800">Audiodaten:</strong> Keine dauerhafte Speicherung (Echtzeitverarbeitung)</li>
                                    <li><strong className="text-slate-800">Ticketdaten:</strong> Für die Dauer des Kundenvertrags, anschließend gemäß den Weisungen des Verantwortlichen</li>
                                    <li><strong className="text-slate-800">Server-Log-Dateien:</strong> max. 30 Tage</li>
                                    <li><strong className="text-slate-800">Vertragsdaten:</strong> 10 Jahre nach Vertragsende (handels- und steuerrechtliche Aufbewahrungspflichten, §§ 147 AO, 257 HGB)</li>
                                </ul>
                                <p>
                                    Nach Ablauf der jeweiligen Fristen werden die Daten routinemäßig gelöscht, sofern keine anderweitigen gesetzlichen Aufbewahrungspflichten bestehen.
                                </p>
                            </section>

                            {/* §11 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 11 SSL/TLS-Verschlüsselung</h2>
                                <p>
                                    Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Alle Datenübertragungen zwischen Ihrem Browser und unseren Servern sowie zwischen unseren Servern und den eingesetzten Drittanbietern erfolgen verschlüsselt.
                                </p>
                            </section>

                            {/* §12 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 12 Änderungen dieser Datenschutzerklärung</h2>
                                <p className="mb-3">
                                    Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie stets den aktuellen rechtlichen Anforderungen anzupassen oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt dann jeweils die aktuelle Datenschutzerklärung.
                                </p>
                                <p className="text-sm text-slate-500 mt-6">
                                    Stand: März 2026
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
