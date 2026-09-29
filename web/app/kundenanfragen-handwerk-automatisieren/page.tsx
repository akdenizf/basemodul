import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  MessageSquare,
  PhoneIncoming,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { faqs, structuredData } from "./seo-data";

export const metadata: Metadata = {
  title: "Kundenanfragen im Handwerk automatisieren | BaseModul",
  description:
    "So organisieren Handwerksbetriebe Kundenanfragen aus Telefon, WhatsApp, Web und Fotos: Pflichtinfos, Zuständigkeit, Übergabe und messbarer Pilot.",
  alternates: {
    canonical: "/kundenanfragen-handwerk-automatisieren",
  },
  openGraph: {
    title: "Kundenanfragen im Handwerk automatisieren | BaseModul",
    description:
      "Ein klarer Anfrageprozess für Handwerksbetriebe: Eingangskanal wählen, Pflichtinformationen erfassen und menschliche Übergaben sichern.",
    url: "/kundenanfragen-handwerk-automatisieren",
    siteName: "BaseModul",
    locale: "de_DE",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Kundenanfragen im Handwerk automatisieren | BaseModul",
    description:
      "Telefon, WhatsApp, Web und Fotos in einen strukturierten Vorgang überführen - mit klarer Übergabe an das Team.",
  },
};

const channels = [
  {
    icon: PhoneIncoming,
    title: "Telefon",
    text: "Anrufe werden zu Rückrufnotizen mit Kontakt, Ort, Anliegen und vereinbartem nächsten Schritt.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    text: "Nachrichten, Fotos und fehlende Angaben werden so abgefragt, dass daraus ein bearbeitbarer Vorgang entsteht.",
  },
  {
    icon: FileText,
    title: "Web & Formulare",
    text: "Web-Anfragen landen nicht nur als E-Mail, sondern mit Pflichtfeldern und Zuständigkeit im richtigen Ablauf.",
  },
];

const processSteps = [
  ["01", "Eingangskanal wählen", "Starten Sie mit dem Kanal, an dem heute am meisten hängen bleibt: Telefon, WhatsApp oder Web."],
  ["02", "Pflichtinformationen festlegen", "Definieren Sie, welche Angaben Ihr Team vor Rückruf, Angebot oder Termin wirklich braucht."],
  ["03", "Übergabe regeln", "Legen Sie fest, wer welche Anfrage bekommt, wann ein Mensch übernehmen muss und welche Fälle nicht automatisiert werden."],
  ["04", "Pilot messen", "Prüfen Sie vollständige Übergaben, Rückrufzeit, Korrekturen und Fallbacks, bevor weitere Module ergänzt werden."],
];

const handoffFields = [
  "Name und Rückrufmöglichkeit",
  "Einsatzort oder Objekt",
  "Gewerk, Anliegen und Dringlichkeit",
  "Fotos, Dokumente oder Zusatzangaben",
  "Zuständige Person oder Team",
  "Nächster Schritt mit Zeitpunkt",
];

export default function CraftRequestAutomationPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-linesoft bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.1em] text-ink">
            BASEMODUL
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-label md:flex">
            <a href="#prozess" className="transition-colors hover:text-leaf">Prozess</a>
            <a href="#pflichtfelder" className="transition-colors hover:text-leaf">Pflichtfelder</a>
            <a href="#fragen" className="transition-colors hover:text-leaf">Fragen</a>
          </nav>
          <a
            href="#check"
            className="inline-flex items-center gap-2 rounded-lg bg-leafbtn px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
          >
            Anfragefluss prüfen <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="px-6 pb-16 pt-[124px] sm:pb-24 lg:pt-[152px]">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_.9fr] lg:gap-16">
            <div>
              <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
                Anfrageprozess für Handwerksbetriebe
              </p>
              <h1 className="mt-5 max-w-[820px] text-[clamp(40px,6.2vw,70px)] font-extrabold leading-[1.04] tracking-[-0.05em] text-ink">
                Kundenanfragen im Handwerk automatisieren, ohne die Kontrolle abzugeben.
              </h1>
              <p className="mt-6 max-w-[660px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
                BaseModul hilft Betrieben, Anfragen aus Telefon, WhatsApp, Web und Fotos in einen klaren Vorgang zu überführen: mit Pflichtinformationen, Zuständigkeit, menschlichem Fallback und messbarem Pilot.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#prozess"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
                >
                  Prozess ansehen <ArrowRight size={16} />
                </a>
                <Link
                  href="/ki-telefonassistent-shk"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-leaf hover:bg-[#F8FAF6]"
                >
                  SHK-Beispiel öffnen
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leaf" /> Menschliche Übergabe bleibt gesetzt</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-leaf" /> Ein Kanal zuerst, Ausbau nach Evidenz</span>
              </div>
            </div>

            <div className="rounded-[8px] border border-line bg-white p-5 shadow-[0_18px_44px_-34px_rgba(31,42,35,0.5)]">
              <div className="rounded-[6px] bg-forestdeep p-5 text-white">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                  Anfrage wird Vorgang
                </p>
                <div className="mt-5 space-y-3">
                  {["Eingang", "Pflichtinfos", "Zuständigkeit", "Nächster Schritt"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-[5px] border border-white/10 bg-white/8 px-3 py-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-white/12 font-mono text-[11px] font-bold">
                        {index + 1}
                      </span>
                      <span className="text-[14px] font-bold">{item}</span>
                      {index < 3 ? <ArrowRight size={15} className="ml-auto text-white/55" /> : <CheckCircle2 size={15} className="ml-auto text-[#BDE0BE]" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-[6px] border border-[#BED2C1] bg-[#EAF0E8] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">Pilot-Logik</p>
                <p className="mt-2 text-[14px] leading-relaxed text-inksoft">
                  Nicht alles auf einmal automatisieren. Erst ein wiederkehrender Anfragefluss, dann messen, nachschärfen und erweitern.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-[1200px]">
            <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
              Wo Anfragen entstehen
            </p>
            <h2 className="mt-5 max-w-[780px] text-[clamp(31px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">
              Die meisten Betriebe haben nicht zu wenig Nachfrage. Sie haben zu viele unsortierte Eingänge.
            </h2>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {channels.map((channel) => (
                <div key={channel.title} className="rounded-[7px] border border-line bg-white p-6 shadow-[0_12px_30px_-26px_rgba(31,42,35,0.38)]">
                  <channel.icon size={24} className="text-leaf" />
                  <h3 className="mt-5 text-[18px] font-bold text-ink">{channel.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-inksoft">{channel.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="prozess" className="px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
                Der robuste Ablauf
              </p>
              <h2 className="mt-5 text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">
                Automatisierung beginnt nicht mit KI. Sie beginnt mit einem sauberen Anfrageprozess.
              </h2>
              <p className="mt-5 max-w-[470px] text-[15px] leading-relaxed text-inksoft">
                Wenn Pflichtfelder, Zuständigkeit und Fallback fehlen, wird auch eine KI nur schneller unklare Arbeit erzeugen. BaseModul setzt deshalb beim kleinsten belastbaren Ablauf an.
              </p>
            </div>
            <div className="grid gap-3">
              {processSteps.map(([number, title, text]) => (
                <div key={number} className="flex gap-5 rounded-[7px] border border-line bg-white p-5 shadow-[0_12px_30px_-28px_rgba(31,42,35,0.32)]">
                  <span className="font-mono text-[12px] font-bold text-[#D8843F]">{number}</span>
                  <div>
                    <h3 className="text-[17px] font-bold text-ink">{title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-inksoft">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pflichtfelder" className="border-y border-linesoft bg-paperdeep px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
                Was eine Anfrage brauchbar macht
              </p>
              <h2 className="mt-5 text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-ink">
                Der Unterschied liegt selten im Tool. Er liegt in der Übergabe.
              </h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-inksoft">
                Eine Anfrage ist erst dann wertvoll, wenn das Team weiß, wen es kontaktieren soll, worum es geht, wie dringend es ist und welcher nächste Schritt erwartet wird.
              </p>
            </div>
            <div className="rounded-[8px] border border-line bg-white p-6 shadow-[0_18px_38px_-30px_rgba(31,42,35,0.35)]">
              <div className="flex items-center gap-3 border-b border-linesoft pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-leaf text-white">
                  <ClipboardList size={20} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Übergabe-Checkliste</p>
                  <h3 className="text-[16px] font-bold text-ink">Pflichtfelder für den Pilot</h3>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {handoffFields.map((field) => (
                  <div key={field} className="flex gap-2 rounded-[5px] border border-linesoft bg-[#F8F8F3] p-3 text-[13px] font-semibold leading-snug text-ink">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-leaf" />
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="check" className="px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[8px] border border-line bg-white p-7 shadow-[0_18px_38px_-30px_rgba(31,42,35,0.35)] sm:p-9">
              <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
                Für wen die Seite gedacht ist
              </p>
              <h2 className="mt-5 text-[31px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">
                Für Betriebe, die Anfragen verlieren, obwohl Nachfrage da ist.
              </h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Rückrufe starten mit fehlenden Informationen",
                  "WhatsApp-Fotos und Telefonnotizen liegen getrennt",
                  "Anfragen werden zu spät oder von der falschen Person bearbeitet",
                  "Das Team will erst einen kleinen, messbaren Ablauf testen",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-inksoft">
                    <ClipboardCheck size={18} className="mt-0.5 shrink-0 text-leaf" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[8px] border border-[#BED2C1] bg-[#EAF0E8] p-7 sm:p-9">
              <p className="border-l-[3px] border-[#D8843F] pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
                Nächster Schritt
              </p>
              <h2 className="mt-5 text-[31px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">
                30 Minuten reichen für den ersten Anfrage-Check.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">
                Wir klären, welcher Kanal zuerst sinnvoll ist, welche Pflichtinformationen fehlen und wann eine menschliche Übergabe zwingend bleibt.
              </p>
              <a
                href="mailto:hello@basemodul.de?subject=Anfrageprozess%20Handwerk%20pruefen"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leafbtn px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
              >
                Anfragefluss prüfen <UserCheck size={16} />
              </a>
              <p className="mt-3 text-center text-[11px] text-inksoft">
                Unverbindlich. Erst Prozess, dann Automatisierung.
              </p>
            </div>
          </div>
        </section>

        <section id="fragen" className="border-t border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
                Häufige Fragen
              </p>
              <h2 className="mt-5 text-[34px] font-extrabold leading-[1.13] tracking-[-0.04em] text-ink">
                Was vor dem Start klar sein sollte.
              </h2>
            </div>
            <div className="divide-y divide-linesoft rounded-[8px] border border-line bg-white px-5 sm:px-7">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <h3 className="text-[15px] font-bold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-inksoft">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-linesoft bg-paperdeep px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-[12px] text-inksoft sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-bold tracking-[0.08em] text-ink">BASEMODUL</span> · Ein Produkt von AGENTEQ</p>
          <div className="flex gap-5">
            <Link href="/impressum" className="hover:text-leaf">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-leaf">Datenschutz</Link>
            <Link href="/" className="hover:text-leaf">Zur Startseite</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
