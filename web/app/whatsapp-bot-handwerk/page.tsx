import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileImage,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { faqs, structuredData } from "./seo-data";

export const metadata: Metadata = {
  title: "WhatsApp-Bot für Handwerksbetriebe | BaseModul",
  description:
    "BaseModul macht aus WhatsApp-Anfragen mit Fotos, Ort und Anliegen einen strukturierten Vorgang für Rückruf, Termin oder menschliche Übergabe.",
  alternates: {
    canonical: "/whatsapp-bot-handwerk",
  },
  openGraph: {
    title: "WhatsApp-Bot für Handwerksbetriebe | BaseModul",
    description:
      "WhatsApp-Nachrichten, Fotos und Pflichtangaben in eine klare Übergabe für Handwerksbetriebe überführen.",
    url: "/whatsapp-bot-handwerk",
    siteName: "BaseModul",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "WhatsApp-Bot für Handwerksbetriebe | BaseModul",
    description:
      "Aus WhatsApp-Anfragen werden strukturierte Vorgänge mit Pflichtinformationen und menschlichem Fallback.",
  },
};

const designContract = `<!--
THESIS: This surface owns the idea "WhatsApp wird Arbeitszettel" and refuses the category-default chatbot demo.
OWN-WORLD: BaseModul paper system, forest green work panels, ruled handoff rows, restrained orange only for missing or urgent information.
STORY: Visitor sees a messy WhatsApp request, understands which fields are missing, then sees the finished handoff and asks for a channel check.
FIRST VIEWPORT: Left side is the plain offer and CTA; right side is a phone-like message strip flowing into a compact work order.
FORM: Grounded candidate 6, staged as an annotated request ledger; seed key 234995c1.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

const messageRows = [
  { icon: MessageSquare, label: "Nachricht", value: "Hallo, wir haben Feuchtigkeit an der Wand. Können Sie schauen?", state: "raw" },
  { icon: Camera, label: "Foto", value: "2 Bilder vorhanden, aber Raum und Objekt fehlen noch", state: "missing" },
  { icon: MapPin, label: "Ort", value: "80331 München, Rückruf ab 16:00 Uhr", state: "ok" },
];

const handoffRows = [
  [UserCheck, "Kontakt", "Frau Schneider · Rückruf ab 16:00 Uhr"],
  [MapPin, "Einsatzort", "80331 München · Wohnung EG"],
  [Wrench, "Anliegen", "Feuchtigkeit an Innenwand, Fotos angehängt"],
  [ClipboardCheck, "Nächster Schritt", "Team prüft Fotos und ruft zurück"],
] as const;

const pilotChecks = [
  "Ein WhatsApp-Anfragefall als Pilot, nicht alle Kanäle auf einmal",
  "Pflichtfelder für Rückruf, Termin oder Angebot",
  "Regeln für unklare, dringende oder sensible Fälle",
  "Messung von Pflichtfeldern, Korrekturen und Rückrufzeit im Pilot",
];

const useCases = [
  ["Reparaturanfrage mit Foto", "Kunde sendet Bild, BaseModul fragt fehlenden Ort, Kontakt und Anliegen ab."],
  ["Terminwunsch", "Aus einer kurzen Nachricht wird ein Rückruf- oder Terminvorschlag mit Zuständigkeit."],
  ["Nachreichung von Unterlagen", "Fotos, Dokumente oder Objektinfos werden dem bestehenden Vorgang zugeordnet."],
];

export default function WhatsappBotHandwerkPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <div dangerouslySetInnerHTML={{ __html: designContract }} />
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
            <a href="#ablauf" className="transition-colors hover:text-leaf">Ablauf</a>
            <a href="#pilot" className="transition-colors hover:text-leaf">Pilot</a>
            <a href="#fragen" className="transition-colors hover:text-leaf">Fragen</a>
          </nav>
          <a
            href="#check"
            className="inline-flex items-center gap-2 rounded-lg bg-leafbtn px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
          >
            WhatsApp prüfen <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="px-6 pb-16 pt-[124px] sm:pb-24 lg:pt-[152px]">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[.98fr_1.02fr] lg:gap-16">
            <div>
              <h1 className="max-w-[820px] text-[clamp(40px,6.1vw,68px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink">
                WhatsApp-Bot für Handwerksbetriebe, der aus Nachrichten klare Vorgänge macht.
              </h1>
              <p className="mt-6 max-w-[650px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
                BaseModul kann in einem abgestimmten WhatsApp-Business-Setup fehlende Angaben abfragen, Fotos einem Vorgang zuordnen und eine Übergabe vorbereiten. Datenschutz, Zuständigkeiten und zulässige Abläufe werden vor dem Go-live geklärt.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#check"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
                >
                  WhatsApp-Anfragen prüfen <ArrowRight size={16} />
                </a>
                <Link
                  href="/kundenanfragen-handwerk-automatisieren"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-leaf hover:bg-[#F8FAF6]"
                >
                  Anfrageprozess ansehen
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft">
                <span className="inline-flex items-center gap-1.5"><FileImage size={14} className="text-leaf" /> Fotos und Pflichtinfos zusammenführen</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leaf" /> Keine autonome Fachentscheidung</span>
              </div>
            </div>

            <div className="work-paper rounded-[6px] p-4 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[.92fr_1.08fr]">
                <div className="rounded-[6px] border border-[#D9D8CF] bg-white p-4">
                  <div className="flex items-center justify-between border-b border-linesoft pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#EAF0E8] text-leaf">
                        <Phone size={16} />
                      </span>
                      <p className="text-[13px] font-bold text-ink">WhatsApp-Eingang</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-faint">synthetisches Beispiel</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {messageRows.map((row) => (
                      <div
                        key={row.label}
                        className={`rounded-[5px] border p-3 ${
                          row.state === "missing" ? "border-[#E5C8AB] bg-[#FCF0E5]" : "border-linesoft bg-[#F8F8F3]"
                        }`}
                      >
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-faint">
                          <row.icon size={13} /> {row.label}
                        </p>
                        <p className="mt-1.5 text-[13px] font-semibold leading-snug text-ink">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[6px] bg-forestdeep p-4 text-white shadow-[0_16px_30px_-24px_rgba(22,56,43,0.72)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-white/66">Übergabe an das Team</p>
                  <h2 className="mt-2 text-[22px] font-extrabold leading-tight">Aus Chat wird Arbeitszettel.</h2>
                  <div className="mt-4 divide-y divide-white/10 rounded-[5px] border border-white/10 bg-white/8">
                    {handoffRows.map(([Icon, label, value]) => (
                      <div key={label} className="grid grid-cols-[104px_1fr] gap-3 px-3 py-3">
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/58">
                          <Icon size={13} /> {label}
                        </p>
                        <p className="text-[13px] font-semibold leading-snug text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#BDE0BE]">
                    <CheckCircle2 size={15} /> Bereit für Rückruf oder manuelle Prüfung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ablauf" className="border-y border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
                Nicht jede WhatsApp-Nachricht ist ein Auftrag. Aber jede gute Übergabe beginnt dort.
              </h2>
              <p className="mt-5 max-w-[500px] text-[15px] leading-relaxed text-inksoft">
                BaseModul behandelt WhatsApp als Eingangskanal: erst verstehen, was fehlt; dann Pflichtfelder abfragen; danach sauber an die richtige Person übergeben.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {useCases.map(([title, text]) => (
                <div key={title} className="rounded-[7px] border border-line bg-white p-6 shadow-[0_12px_30px_-26px_rgba(31,42,35,0.38)]">
                  <MessageSquare size={22} className="text-leaf" />
                  <h3 className="mt-5 text-[18px] font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-inksoft">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pilot" className="px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[8px] border border-line bg-white p-7 shadow-[0_18px_38px_-30px_rgba(31,42,35,0.35)] sm:p-9">
              <h2 className="text-[31px] font-extrabold leading-[1.13] tracking-[-0.03em] text-ink">
                Ein WhatsApp-Pilot braucht Regeln, nicht nur Antworten.
              </h2>
              <ul className="mt-7 space-y-4">
                {pilotChecks.map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-inksoft">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-leaf" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div id="check" className="rounded-[8px] border border-[#BED2C1] bg-[#EAF0E8] p-7 sm:p-9">
              <h2 className="text-[31px] font-extrabold leading-[1.13] tracking-[-0.03em] text-ink">
                In 30 Minuten den WhatsApp-Anfragefluss prüfen.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">
                Wir klären, welche WhatsApp-Anfragen heute unvollständig ankommen, welche Pflichtfelder fehlen und wann Ihr Team übernehmen muss.
              </p>
              <a
                href="mailto:hello@basemodul.de?subject=WhatsApp-Anfragefluss%20Handwerk%20pruefen"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leafbtn px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
              >
                WhatsApp-Anfragefluss prüfen <ArrowUpRight size={16} />
              </a>
              <p className="mt-3 text-center text-[11px] text-inksoft">Unverbindlich. Erst ein Anfragefall, dann Ausbau.</p>
            </div>
          </div>
        </section>

        <section id="fragen" className="border-t border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-16">
            <div>
              <h2 className="text-[34px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">
                Häufige Fragen zu WhatsApp im Handwerk.
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
