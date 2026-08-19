import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  MapPin,
  PhoneIncoming,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Anfragen für SHK-Betriebe zuverlässig annehmen | BaseModul",
  description:
    "BaseModul macht aus verpassten oder unvollständigen SHK-Anfragen klare Rückrufe, vollständige Übergaben und nachvollziehbare nächste Schritte.",
};

const pilotSteps = [
  { number: "01", title: "Einen Eingang festlegen", text: "Wir beginnen dort, wo Anfragen heute liegen bleiben: meist am Telefon, bei Bedarf über WhatsApp oder die Website." },
  { number: "02", title: "Die richtigen Infos sichern", text: "Kontakt, Ort, Anliegen, Rückrufnummer und Dringlichkeit kommen vollständig bei Ihrer zuständigen Person an." },
  { number: "03", title: "30 Tage im Alltag prüfen", text: "Sie beurteilen reale Übergaben, Rückrufe und Korrekturen aus Ihrem Betrieb – nicht eine abstrakte KI-Demo." },
];

const scorecardRows = [
  ["Relevante Eingänge", "Wie viele Anfragen im ausgewählten Kanal tatsächlich beim Betrieb ankommen."],
  ["Nicht angenommene Anrufe", "Welche Anfragen Ihr Team ohne den Ablauf nicht oder nicht rechtzeitig erreicht hätte."],
  ["Vollständige Übergaben", "Ob Kontakt, Ort, Anliegen und die vereinbarten Pflichtfelder vor dem Rückruf vorliegen."],
  ["Zeit bis zur Übergabe", "Wie schnell eine relevante Anfrage bei der zuständigen Person liegt."],
  ["Rückruf- oder Terminquote", "Ob qualifizierte Anfragen einen nachvollziehbaren nächsten Schritt erhalten."],
];

const faqs = [
  { question: "Ersetzt BaseModul unsere Disposition oder Rezeption?", answer: "Nein. BaseModul sichert die erste Aufnahme der Anfragen, die heute durchfallen – etwa während Einsätzen oder außerhalb der Erreichbarkeit. Zuständigkeit und fachliche Entscheidung bleiben bei Ihrem Team." },
  { question: "Müssen wir unsere bestehende Nummer ändern?", answer: "Nein. Ein Pilot kann mit einer Testnummer starten. Später lässt sich Ihre Nummer nach klaren Regeln weiterleiten, etwa außerhalb der Bürozeit oder nach einer vereinbarten Zahl an Klingelzeichen." },
  { question: "Entscheidet BaseModul selbst, ob ein Notfall vorliegt?", answer: "Nein. Der Ablauf arbeitet nach Ihren vorab vereinbarten Signalen und fragt die benötigten Informationen ab. Kritische Fälle werden an eine menschliche Bereitschaft oder zuständige Person weitergeleitet." },
  { question: "Was kostet der Einstieg?", answer: "Ein klar abgegrenzter Einstieg beginnt ab 750 € Setup. Umfang, laufende Kosten und mögliche Telefonie- oder Messaging-Gebühren legen wir vor dem Start transparent fest." },
];

export default function ShkIntakePage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-linesoft bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.1em] text-ink">BASEMODUL</Link>
          <div className="hidden items-center gap-6 text-[13px] font-semibold text-label sm:flex">
            <a href="#ablauf" className="transition-colors hover:text-leaf">Ablauf</a>
            <a href="#pilot" className="transition-colors hover:text-leaf">30-Tage-Pilot</a>
            <a href="#fragen" className="transition-colors hover:text-leaf">Fragen</a>
          </div>
          <a href="#check" className="inline-flex items-center gap-2 rounded-lg bg-leafbtn px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover">30-Minuten-Check <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-[124px] sm:pb-24 lg:pt-[156px]">
          <div className="pointer-events-none absolute left-[-8%] top-0 h-[520px] w-[620px] rounded-full bg-[#E6EFE4] blur-3xl" />
          <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:gap-16">
            <div>
              <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Für SHK-Betriebe in München & Umgebung</p>
              <h1 className="mt-5 max-w-[740px] text-[clamp(42px,6.5vw,73px)] font-extrabold leading-[1.03] tracking-[-0.05em] text-ink">Wenn Ihr Team im Einsatz ist, darf keine Anfrage <span className="text-leaf">im Leeren landen.</span></h1>
              <p className="mt-6 max-w-[620px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">BaseModul macht aus Telefon-, WhatsApp- und Web-Anfragen vollständige Rückrufnotizen. Damit Ihre Leute nicht erst suchen müssen, was passiert ist – sondern direkt wissen, was zu tun ist.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#check" className="group inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover">30-Minuten-Check buchen <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
                <a href="#beispiel" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-leaf hover:bg-[#F8FAF6]">Beispiel-Vorgang ansehen</a>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leaf" /> Klare menschliche Übergaben</span><span className="inline-flex items-center gap-1.5"><ClipboardCheck size={14} className="text-leaf" /> 30 Tage messbar prüfen</span></div>
            </div>

            <div id="beispiel" className="work-paper relative mx-auto w-full max-w-[540px] rounded-[6px] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-[#D9D8CF] pb-4">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-leaf text-white"><PhoneIncoming size={19} /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Neue Rückrufnotiz</p><p className="mt-0.5 text-[14px] font-bold text-ink">Heizung ausgefallen · Rückruf benötigt</p></div></div>
                <span className="border border-[#E5C8AB] bg-[#FCF0E5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#A75420]">Dringend</span>
              </div>
              <div className="mt-2">
                {([
                  [User, "Kunde", "Frau Schneider · 0176 24•• •••"],
                  [MapPin, "Einsatzort", "80331 München"],
                  [Wrench, "Anliegen", "Heizung kalt seit heute Morgen"],
                  [Camera, "Anhänge", "2 Fotos angefordert"],
                  [Clock3, "Eingang", "22:47 Uhr · außerhalb Bürozeit"],
                ] as const).map(([Icon, label, value]) => {
                  return <div key={label} className="grid grid-cols-[100px_1fr] gap-3 border-b border-dashed border-[#D9D8CF] py-3.5 sm:grid-cols-[122px_1fr]"><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-faint"><Icon size={13} />{label}</p><p className="text-[13px] font-semibold leading-snug text-ink">{value}</p></div>;
                })}
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded-[5px] border border-[#BED2C1] bg-[#EAF0E8] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-leaf">Nächster Schritt</p><p className="mt-1 text-[15px] font-bold text-ink">Bereitschaft ruft zurück.</p></div><span className="inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-leaf"><CheckCircle2 size={15} /> Übergabe bereit</span></div>
            </div>
          </div>
        </section>

        <section className="border-y border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-[1200px]"><p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Der Engpass im Alltag</p><h2 className="mt-5 max-w-[780px] text-[clamp(31px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">Der Erstkontakt passiert genau dann, wenn Ihre Leute nicht am Schreibtisch sitzen.</h2>
            <div className="mt-9 grid gap-4 md:grid-cols-3">{[["Auf der Baustelle", "Ein Anruf erreicht niemanden, weil Fachpersonal gerade beim Kunden ist."],["Außerhalb der Bürozeit", "Der Interessent landet in der Mailbox, obwohl der Anlass nicht bis morgen warten soll."],["Unvollständige Anfrage", "Adresse, Anlage, Fotos oder Dringlichkeit fehlen – und der Rückruf beginnt wieder bei null."]].map(([title,text], index) => <div key={title} className="rounded-[7px] border border-line bg-white p-6 shadow-[0_12px_30px_-26px_rgba(31,42,35,0.38)]"><span className="font-mono text-[11px] font-bold text-[#D8843F]">0{index+1}</span><h3 className="mt-5 text-[18px] font-bold text-ink">{title}</h3><p className="mt-2 text-[14px] leading-relaxed text-inksoft">{text}</p></div>)}</div>
          </div>
        </section>

        <section id="ablauf" className="px-6 py-16 sm:py-24"><div className="mx-auto grid max-w-[1200px] gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16"><div><p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Ein sauberer Einstieg</p><h2 className="mt-5 text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">Nicht gleich alles automatisieren. Erst eine Anfrage zuverlässig in Arbeit verwandeln.</h2><p className="mt-5 max-w-[470px] text-[15px] leading-relaxed text-inksoft">Der Pilot bleibt bewusst klein. Er schafft einen verlässlichen Eingang und einen klaren Übergabepunkt. Weitere Module folgen nur dann, wenn sie Ihren Alltag wirklich vereinfachen.</p></div><div className="grid gap-3">{pilotSteps.map((step) => <div key={step.number} className="group flex gap-5 rounded-[7px] border border-line bg-white p-5 shadow-[0_12px_30px_-28px_rgba(31,42,35,0.32)] transition hover:border-[#A8C2AA]"><span className="font-mono text-[12px] font-bold text-[#D8843F]">{step.number}</span><div><h3 className="text-[17px] font-bold text-ink">{step.title}</h3><p className="mt-1.5 text-[14px] leading-relaxed text-inksoft">{step.text}</p></div><ChevronRight size={18} className="ml-auto mt-1 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-leaf" /></div>)}</div></div></section>

        <section id="pilot" className="border-y border-linesoft bg-paperdeep px-6 py-16 sm:py-24"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-[710px]"><p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">30-Tage-Pilot mit Scorecard</p><h2 className="mt-5 text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">Keine diffuse KI-Demo. Ein Ablauf, den Sie im Betrieb prüfen können.</h2></div><p className="max-w-[340px] text-[14px] leading-relaxed text-inksoft">Wir berichten Wirkung, nicht Versprechen. Ist eine Kennzahl bei Ihnen noch nicht sauber verfügbar, wird sie als nicht verfügbar markiert – nicht geschätzt.</p></div><div className="mt-9 overflow-hidden rounded-[7px] border border-line bg-white"><div className="grid grid-cols-[minmax(140px,.72fr)_1.28fr] border-b border-line bg-[#F8F8F3] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint sm:grid-cols-[.7fr_1.8fr]"><span>Kennzahl</span><span>Was sie zeigt</span></div>{scorecardRows.map(([metric, explanation], index) => <div key={metric} className={`grid grid-cols-[minmax(140px,.72fr)_1.28fr] gap-4 px-4 py-4 sm:grid-cols-[.7fr_1.8fr] ${index !== scorecardRows.length-1 ? "border-b border-linesoft" : ""}`}><p className="text-[13px] font-bold text-ink">{metric}</p><p className="text-[13px] leading-relaxed text-inksoft">{explanation}</p></div>)}</div></div></section>

        <section className="px-6 py-16 sm:py-24"><div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.05fr_.95fr]"><div className="rounded-[8px] border border-line bg-white p-7 shadow-[0_18px_38px_-30px_rgba(31,42,35,0.35)] sm:p-9"><p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Was im Pilot enthalten ist</p><h2 className="mt-5 text-[31px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">Ein Eingangskanal. Ein sauberer Ablauf. Echte Fälle.</h2><ul className="mt-7 space-y-4">{["Klarer Fragenkatalog für Ihre typischen SHK-Anfragen","Vereinbarte Pflichtfelder und menschliche Übergaben","Testfälle für Normalfall, unvollständige Anfrage und kritischen Fall","Wöchentlicher Blick auf die Pilot-Scorecard","Abschlussgespräch mit klarer Ausbau-, Nachschärfungs- oder Pause-Entscheidung"].map((item) => <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-inksoft"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-leaf" />{item}</li>)}</ul></div><div id="check" className="rounded-[8px] border border-[#BED2C1] bg-[#EAF0E8] p-7 sm:p-9"><p className="border-l-[3px] border-[#D8843F] pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Der nächste Schritt</p><h2 className="mt-5 text-[31px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">In 30 Minuten den größten Anfrage-Engpass finden.</h2><p className="mt-4 text-[15px] leading-relaxed text-inksoft">Wir klären, welcher Eingangskanal heute Anfragen verliert, welche Pflichtinfos Ihr Team wirklich benötigt und ob ein schlanker Pilot sinnvoll ist.</p><div className="mt-8 rounded-[5px] border border-[#C8D8C8] bg-white/70 p-4 text-[13px] text-inksoft"><p className="font-bold text-ink">Start ab 750 € Setup</p><p className="mt-1.5 leading-relaxed">Konkreter Umfang, laufende Kosten und Datenverarbeitung werden vor dem Pilot transparent festgelegt.</p></div><a href="mailto:hello@basemodul.de?subject=30-Minuten-Check%20SHK" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leafbtn px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover">30-Minuten-Check anfragen <ArrowUpRight size={16} /></a><p className="mt-3 text-center text-[11px] text-inksoft">Unverbindlich. Kein Komplettsystem im Erstgespräch.</p></div></div></section>

        <section id="fragen" className="border-t border-linesoft bg-paper2 px-6 py-16 sm:py-24"><div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-16"><div><p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Häufige Fragen</p><h2 className="mt-5 text-[34px] font-extrabold leading-[1.13] tracking-[-0.04em] text-ink">Klarheit vor dem Start.</h2></div><div className="divide-y divide-linesoft rounded-[8px] border border-line bg-white px-5 sm:px-7">{faqs.map((faq) => <div key={faq.question} className="py-5"><h3 className="text-[15px] font-bold text-ink">{faq.question}</h3><p className="mt-2 text-[14px] leading-relaxed text-inksoft">{faq.answer}</p></div>)}</div></div></section>
      </main>

      <footer className="border-t border-linesoft bg-paperdeep px-6 py-8"><div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-[12px] text-inksoft sm:flex-row sm:items-center sm:justify-between"><p><span className="font-bold tracking-[0.08em] text-ink">BASEMODUL</span> · Ein Produkt von AGENTEQ</p><div className="flex gap-5"><Link href="/impressum" className="hover:text-leaf">Impressum</Link><Link href="/datenschutz" className="hover:text-leaf">Datenschutz</Link><Link href="/" className="hover:text-leaf">Zur Startseite</Link></div></div></footer>
    </div>
  );
}
