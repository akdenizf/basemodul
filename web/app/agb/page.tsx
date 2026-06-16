import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AGB | AGENTEQ',
    description: 'Allgemeine Geschäftsbedingungen für die B2B SaaS-Plattform AGENTEQ.',
};

export default function AgbPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <main className="flex-1 pt-32 pb-24">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 md:p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-8 pb-8 border-b border-slate-100">
                            Allgemeine Geschäftsbedingungen
                        </h1>

                        <div className="space-y-10 text-slate-600 leading-relaxed">

                            <section>
                                <p className="text-lg">
                                    Die nachfolgenden Allgemeinen Geschäftsbedingungen (AGB) regeln das Vertragsverhältnis zwischen der AGENTEQ, Fatih Mehmet Akdeniz, Karl-Marx-Ring 17, 81735 München (nachfolgend &quot;AGENTEQ&quot; oder &quot;Anbieter&quot;) und dem Kunden (nachfolgend &quot;Kunde&quot;) über die Nutzung der SaaS-Plattform &quot;AGENTEQ&quot;.
                                </p>
                            </section>

                            {/* §1 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 1 Geltungsbereich</h2>
                                <p className="mb-3">
                                    (1) Diese AGB gelten ausschließlich für Unternehmer im Sinne des § 14 BGB, die die Plattform im Rahmen ihrer gewerblichen Tätigkeit nutzen. AGENTEQ richtet sich nicht an Verbraucher im Sinne des § 13 BGB.
                                </p>
                                <p className="mb-3">
                                    (2) Abweichende, entgegenstehende oder ergänzende Geschäftsbedingungen des Kunden werden nur dann Vertragsbestandteil, wenn und soweit der Anbieter ihrer Geltung ausdrücklich schriftlich zugestimmt hat.
                                </p>
                                <p>
                                    (3) Diese AGB gelten in ihrer jeweils aktuellen Fassung auch für alle zukünftigen Geschäftsbeziehungen zwischen den Parteien, selbst wenn sie nicht nochmals ausdrücklich vereinbart werden.
                                </p>
                            </section>

                            {/* §2 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 2 Vertragsabschluss und Laufzeit</h2>
                                <p className="mb-3">
                                    (1) Der Vertrag kommt durch die Registrierung des Kunden auf der Plattform und die Bestätigung der AGB oder durch Unterzeichnung eines individuellen Angebots zustande.
                                </p>
                                <p className="mb-3">
                                    (2) Die Mindestvertragslaufzeit sowie der Abrechnungszeitraum (monatlich oder jährlich) ergeben sich aus dem vom Kunden gewählten Tarifmodell. Die jeweiligen Konditionen sind auf der Website unter dem Bereich &quot;Preise&quot; einsehbar.
                                </p>
                                <p>
                                    (3) Nach Ablauf der Mindestlaufzeit verlängert sich der Vertrag automatisch um den jeweiligen Verlängerungszeitraum (einen Monat bei Monatsabrechnung, ein Jahr bei Jahresabrechnung), sofern er nicht von einer der Parteien unter Einhaltung einer Frist von 30 Tagen zum Ende der jeweiligen Laufzeit gekündigt wird.
                                </p>
                            </section>

                            {/* §3 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 3 Leistungsbeschreibung</h2>
                                <p className="mb-3">
                                    (1) AGENTEQ stellt dem Kunden eine KI-basierte Telefonzentrale als Software-as-a-Service (SaaS) zur Verfügung. Die Plattform umfasst insbesondere folgende Kernleistungen:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                                    <li><strong className="text-slate-800">KI-Telefonassistent:</strong> Automatisierte Entgegennahme eingehender Anrufe, Erfassung und Kategorisierung von Kundenanliegen (Schadensmeldungen, kaufmännische Anfragen) mittels Spracherkennung und KI-Analyse.</li>
                                    <li><strong className="text-slate-800">Ticket-Management-System:</strong> Automatische Erstellung strukturierter Tickets mit Dringlichkeitsbewertung, Kundenzuordnung und Aktivitätsprotokollierung.</li>
                                    <li><strong className="text-slate-800">Visual Context (Foto-Upload):</strong> SMS-basierte Aufforderung an Endkunden zur Übermittlung von Schadensfotos, die dem jeweiligen Ticket zugeordnet werden.</li>
                                    <li><strong className="text-slate-800">Benachrichtigungssystem:</strong> Automatisierte E-Mail-Benachrichtigungen über neue und aktualisierte Tickets an den Kunden.</li>
                                    <li><strong className="text-slate-800">Admin-Dashboard:</strong> Webbasierte Verwaltungsoberfläche zur Einsicht, Bearbeitung und Weiterleitung von Tickets inklusive Handwerker-CRM und Kommunikationsvorlagen.</li>
                                </ul>
                                <p>
                                    (2) Der KI-Telefonassistent ist ein <strong className="text-slate-800">technisches Assistenzsystem</strong>. Er dient der Ersterfassung und Vorqualifizierung von Kundenanliegen und ersetzt keine menschliche Entscheidungsfindung. Die finale Beurteilung, Priorisierung und Bearbeitung der Tickets obliegt ausschließlich dem Kunden.
                                </p>
                            </section>

                            {/* §4 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 4 Pflichten des Kunden</h2>
                                <p className="mb-3">
                                    (1) Der Kunde verpflichtet sich, die Plattform ausschließlich im Rahmen der geltenden Gesetze und dieser AGB zu nutzen. Insbesondere darf der Kunde keine rechtswidrigen Inhalte über die Plattform verarbeiten oder verbreiten.
                                </p>
                                <p className="mb-3">
                                    (2) Der Kunde ist für die Richtigkeit und Aktualität der von ihm hinterlegten Stammdaten (Endkundendaten, Objektdaten, Kontaktdaten von Handwerkern) selbst verantwortlich. Eine fehlerhafte Datenbasis kann die Qualität der automatisierten Zuordnung beeinträchtigen.
                                </p>
                                <p className="mb-3">
                                    (3) Zugangsdaten zur Plattform sind vertraulich zu behandeln und vor dem Zugriff durch unbefugte Dritte zu schützen. Der Kunde haftet für jede Nutzung seines Zugangs, sofern er die unbefugte Nutzung zu vertreten hat.
                                </p>
                                <p>
                                    (4) Der Kunde ist verpflichtet, die über AGENTEQ eingehenden Tickets <strong className="text-slate-800">zeitnah zu prüfen und eigenständig zu bearbeiten</strong>. Insbesondere bei als dringend oder Notfall eingestuften Meldungen obliegt dem Kunden die unverzügliche menschliche Überprüfung und ggf. die Einleitung geeigneter Maßnahmen.
                                </p>
                            </section>

                            {/* §5 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 5 Vergütung und Zahlungsbedingungen</h2>
                                <p className="mb-3">
                                    (1) Die Vergütung richtet sich nach dem vom Kunden gewählten Tarifmodell. Alle angegebenen Preise verstehen sich als Nettopreise zuzüglich der jeweils geltenden gesetzlichen Umsatzsteuer.
                                </p>
                                <p className="mb-3">
                                    (2) Die Rechnungsstellung erfolgt monatlich oder jährlich im Voraus. Rechnungen sind innerhalb von 14 Tagen nach Zugang zur Zahlung fällig.
                                </p>
                                <p className="mb-3">
                                    (3) Kommt der Kunde mit der Zahlung in Verzug, ist der Anbieter nach vorheriger schriftlicher Mahnung und Setzung einer angemessenen Nachfrist berechtigt, den Zugang zur Plattform vorübergehend zu sperren. Die Pflicht zur Zahlung der vereinbarten Vergütung bleibt hiervon unberührt.
                                </p>
                                <p>
                                    (4) Der Anbieter behält sich das Recht vor, die Preise mit einer Ankündigungsfrist von 60 Tagen zum Ende der jeweiligen Vertragslaufzeit anzupassen. Der Kunde hat in diesem Fall ein Sonderkündigungsrecht zum Zeitpunkt des Inkrafttretens der Preisanpassung.
                                </p>
                            </section>

                            {/* §6 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 6 Verfügbarkeit und Service Level</h2>
                                <p className="mb-3">
                                    (1) Der Anbieter ist bestrebt, eine Verfügbarkeit der Plattform von <strong className="text-slate-800">99,0 % im Monatsmittel</strong> zu gewährleisten (gemessen an den Betriebsstunden des jeweiligen Kalendermonats). Hiervon ausgenommen sind:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                                    <li>Geplante Wartungsarbeiten, die mindestens 48 Stunden im Voraus per E-Mail angekündigt werden und vorzugsweise in den Abend- und Nachtstunden (20:00–06:00 Uhr MEZ) durchgeführt werden.</li>
                                    <li>Störungen, die auf höhere Gewalt, Netzwerkausfälle Dritter oder Handlungen des Kunden zurückzuführen sind.</li>
                                    <li>Ausfälle der eingesetzten Drittanbieterdienste (Vapi, Twilio, Supabase), auf die der Anbieter keinen direkten Einfluss hat.</li>
                                </ul>
                                <p>
                                    (2) Der Anbieter wird Störungen unverzüglich nach Kenntniserlangung beheben. Kritische Störungen, die die Kernfunktionalität betreffen (Anrufannahme, Ticketerstellung), werden mit höchster Priorität behandelt.
                                </p>
                            </section>

                            {/* §7 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 7 Haftungsbeschränkung</h2>
                                <p className="mb-3">
                                    (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für vorsätzlich oder grob fahrlässig verursachte Schäden.
                                </p>
                                <p className="mb-3">
                                    (2) Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). Die Haftung ist in diesen Fällen auf den vertragstypischen, vorhersehbaren Schaden begrenzt, höchstens jedoch auf die vom Kunden in den letzten 12 Monaten gezahlte Vergütung.
                                </p>
                                <p className="mb-3">
                                    (3) <strong className="text-slate-800">Der KI-Telefonassistent ist ein technisches Hilfsmittel zur Ersterfassung von Kundenanliegen.</strong> Der Anbieter übernimmt ausdrücklich keine Gewähr für:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                                    <li>Die inhaltliche Richtigkeit, Vollständigkeit oder Korrektheit der durch die KI generierten Zusammenfassungen, Kategorisierungen oder Dringlichkeitsbewertungen (&quot;KI-Halluzinationen&quot;).</li>
                                    <li>Die lückenlose und fehlerfreie Erkennung aller Schadensmeldungen, insbesondere von Notfällen oder sicherheitskritischen Situationen.</li>
                                    <li>Schäden, die daraus entstehen, dass der Kunde auf eine eigenständige Überprüfung und Bearbeitung der KI-generierten Tickets verzichtet.</li>
                                </ul>
                                <p>
                                    (4) Die finale Verantwortung für die rechtzeitige und sachgerechte Bearbeitung von Kundenanliegen verbleibt ausschließlich beim Kunden. Dieser ist insbesondere verpflichtet, als dringend eingestufte Meldungen unverzüglich menschlich zu überprüfen.
                                </p>
                            </section>

                            {/* §8 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 8 Datenschutz und Geheimhaltung</h2>
                                <p className="mb-3">
                                    (1) Beide Parteien verpflichten sich, die ihnen im Rahmen der Vertragsbeziehung bekannt gewordenen vertraulichen Informationen der jeweils anderen Partei zeitlich unbegrenzt vertraulich zu behandeln und nur für die Zwecke der Vertragserfüllung zu verwenden.
                                </p>
                                <p className="mb-3">
                                    (2) Die Verarbeitung personenbezogener Daten durch den Anbieter erfolgt im Einklang mit den geltenden datenschutzrechtlichen Bestimmungen, insbesondere der DSGVO und dem BDSG. Einzelheiten sind in unserer <a href="/datenschutz" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Datenschutzerklärung</a> geregelt.
                                </p>
                                <p>
                                    (3) Sofern der Anbieter im Auftrag des Kunden personenbezogene Daten verarbeitet, wird ein Vertrag zur Auftragsverarbeitung (AVV) gemäß Art.&nbsp;28 DSGVO geschlossen. Der Anbieter verarbeitet die Daten ausschließlich nach dokumentierter Weisung des Kunden.
                                </p>
                            </section>

                            {/* §9 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 9 Laufzeit und Kündigung</h2>
                                <p className="mb-3">
                                    (1) Die ordentliche Kündigung des Vertrags ist mit einer Frist von 30 Tagen zum Ende der jeweiligen Vertragslaufzeit möglich. Die Kündigung bedarf der Textform (E-Mail ist ausreichend).
                                </p>
                                <p className="mb-3">
                                    (2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor, wenn eine Partei wesentliche Vertragspflichten trotz Abmahnung wiederholt verletzt oder wenn über das Vermögen einer Partei ein Insolvenzverfahren eingeleitet wird.
                                </p>
                                <p>
                                    (3) Nach Beendigung des Vertrags wird der Anbieter dem Kunden seine Daten in einem gängigen, maschinenlesbaren Format auf Anforderung innerhalb von 30 Tagen zur Verfügung stellen. Anschließend werden alle kundenbezogenen Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                                </p>
                            </section>

                            {/* §10 */}
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">§ 10 Schlussbestimmungen</h2>
                                <p className="mb-3">
                                    (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).
                                </p>
                                <p className="mb-3">
                                    (2) Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist München, sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
                                </p>
                                <p className="mb-3">
                                    (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so wird dadurch die Wirksamkeit der übrigen Bestimmungen nicht berührt. Anstelle der unwirksamen Bestimmung gilt eine wirksame Regelung als vereinbart, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt (salvatorische Klausel).
                                </p>
                                <p className="mb-3">
                                    (4) Änderungen und Ergänzungen dieser AGB bedürfen zu ihrer Wirksamkeit der Textform. Dies gilt auch für die Aufhebung dieser Schriftformklausel.
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
