import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Headphones,
  MapPin,
  PhoneCall,
  PhoneIncoming,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { faqs, structuredData } from "./seo-data";

export const metadata: Metadata = {
  title: "Telefonservice für Handwerksbetriebe | BaseModul",
  description:
    "BaseModul nimmt Anrufe strukturiert auf, bereitet Rückrufe vor und übergibt unklare oder kritische Fälle nach vereinbarten Regeln an Menschen.",
  alternates: {
    canonical: "/telefonservice-handwerk",
  },
  openGraph: {
    title: "Telefonservice für Handwerksbetriebe | BaseModul",
    description:
      "Anrufannahme für Handwerksbetriebe: Kontakt, Einsatzort, Anliegen und Dringlichkeit in eine klare Übergabe bringen.",
    url: "/telefonservice-handwerk",
    siteName: "BaseModul",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Telefonservice für Handwerksbetriebe | BaseModul",
    description:
      "Aus verpassten oder unvollständigen Anrufen werden strukturierte Rückrufnotizen mit menschlichem Fallback.",
  },
};

const intakeRows = [
  [UserCheck, "Kontakt", "Herr Bauer · Rückruf heute Nachmittag"],
  [MapPin, "Ort", "80939 München · Gewerbeeinheit"],
  [Wrench, "Anliegen", "Wartungsanfrage, Anlage macht Geräusche"],
  [Clock3, "Eingang", "11:42 Uhr · Team im Einsatz"],
] as const;

const steps = [
  ["Anruf annehmen", "Der Ablauf erfasst zunächst, wer anruft und wie die Person erreichbar ist."],
  ["Pflichtinfos klären", "Einsatzort, Anliegen, Dringlichkeit und fehlende Unterlagen werden strukturiert abgefragt."],
  ["Übergabe vorbereiten", "Ihr Team bekommt eine Rückrufnotiz statt einer leeren Mailbox oder losen Telefonnotiz."],
  ["Mensch übernimmt", "Unklare, sensible oder kritische Fälle gehen nach vereinbarten Regeln an eine zuständige Person."],
];

const comparison = [
  ["Klassischer Telefonservice", "Nimmt oft allgemein entgegen und leitet Nachrichten weiter."],
  ["BaseModul", "Fokussiert auf Pflichtinformationen, Zuständigkeit und nachvollziehbaren nächsten Schritt."],
  ["Ihr Team", "Bleibt verantwortlich für fachliche Entscheidung, Priorität und Kundenkommunikation."],
];

export default function TelefonserviceHandwerkPage() {
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
            <a href="#ablauf" className="transition-colors hover:text-leaf">Ablauf</a>
            <a href="#abgrenzung" className="transition-colors hover:text-leaf">Abgrenzung</a>
            <a href="#fragen" className="transition-colors hover:text-leaf">Fragen</a>
          </nav>
          <a
            href="#check"
            className="inline-flex items-center gap-2 rounded-lg bg-leafbtn px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
          >
            Anrufannahme prüfen <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="px-6 pb-16 pt-[124px] sm:pb-24 lg:pt-[152px]">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_.95fr] lg:gap-16">
            <div>
              <h1 className="max-w-[820px] text-[clamp(40px,6.1vw,68px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink">
                Telefonservice für Handwerksbetriebe, der aus Anrufen Rückrufnotizen macht.
              </h1>
              <p className="mt-6 max-w-[650px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
                BaseModul nimmt Anfragen strukturiert auf, fragt fehlende Pflichtinformationen ab und bereitet die Übergabe an Ihr Team vor. Fachliche Entscheidung und kritische Fälle bleiben bei Menschen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#check"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
                >
                  Anrufannahme prüfen <ArrowRight size={16} />
                </a>
                <Link
                  href="/ki-telefonassistent-shk"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-leaf hover:bg-[#F8FAF6]"
                >
                  SHK-Beispiel ansehen
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft">
                <span className="inline-flex items-center gap-1.5"><PhoneIncoming size={14} className="text-leaf" /> Rückrufnotiz statt Mailbox</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leaf" /> Menschliche Übergabe bleibt gesetzt</span>
              </div>
            </div>

            <div className="work-paper rounded-[6px] p-4 sm:p-6">
              <div className="rounded-[6px] bg-forestdeep p-5 text-white shadow-[0_16px_30px_-24px_rgba(22,56,43,0.72)]">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-white/12">
                      <Headphones size={20} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-white/58">Anruf wird Vorgang</p>
                      <h2 className="text-[18px] font-extrabold">Neue Rückrufnotiz</h2>
                    </div>
                  </div>
                  <span className="rounded-[4px] border border-white/15 bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white/72">
                    Beispiel
                  </span>
                </div>
                <div className="mt-4 divide-y divide-white/10 rounded-[5px] border border-white/10 bg-white/8">
                  {intakeRows.map(([Icon, label, value]) => (
                    <div key={label} className="grid grid-cols-[90px_1fr] gap-3 px-3 py-3 sm:grid-cols-[112px_1fr]">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/58">
                        <Icon size={13} /> {label}
                      </p>
                      <p className="text-[13px] font-semibold leading-snug text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-[#BDE0BE]">
                  <CheckCircle2 size={15} /> Team erhält Kontext vor dem Rückruf.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ablauf" className="border-y border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
                Der Wert liegt nicht im Abheben. Er liegt in der brauchbaren Übergabe.
              </h2>
              <p className="mt-5 max-w-[500px] text-[15px] leading-relaxed text-inksoft">
                Ein angenommener Anruf hilft wenig, wenn Rückrufnummer, Ort oder Anliegen fehlen. BaseModul macht den Eingangskanal deshalb messbar und prüfbar.
              </p>
            </div>
            <div className="grid gap-3">
              {steps.map(([title, text], index) => (
                <div key={title} className="flex gap-5 rounded-[7px] border border-line bg-white p-5 shadow-[0_12px_30px_-28px_rgba(31,42,35,0.32)]">
                  <span className="font-mono text-[12px] font-bold text-[#D8843F]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[17px] font-bold text-ink">{title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-inksoft">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="abgrenzung" className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="max-w-[780px] text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
              Nicht “wir gehen immer dran”. Sondern: Der richtige nächste Schritt ist vorbereitet.
            </h2>
            <div className="mt-9 overflow-hidden rounded-[7px] border border-line bg-white">
              {comparison.map(([title, text], index) => (
                <div key={title} className={`grid gap-3 px-5 py-5 sm:grid-cols-[260px_1fr] ${index !== comparison.length - 1 ? "border-b border-linesoft" : ""}`}>
                  <p className="text-[14px] font-bold text-ink">{title}</p>
                  <p className="text-[14px] leading-relaxed text-inksoft">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="check" className="border-y border-linesoft bg-paperdeep px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[8px] border border-line bg-white p-7 shadow-[0_18px_38px_-30px_rgba(31,42,35,0.35)] sm:p-9">
              <h2 className="text-[31px] font-extrabold leading-[1.13] tracking-[-0.03em] text-ink">
                Ein Telefon-Pilot beginnt mit einem klaren Zeitfenster oder Anfragefall.
              </h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Anrufe außerhalb einer vereinbarten Bürozeit",
                  "Rückrufe, bei denen Pflichtinformationen heute fehlen",
                  "Weiterleitung nach definierter Klingelzeit",
                  "Manuelle Eskalation bei unklaren oder kritischen Fällen",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-inksoft">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-leaf" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[8px] border border-[#BED2C1] bg-[#EAF0E8] p-7 sm:p-9">
              <h2 className="text-[31px] font-extrabold leading-[1.13] tracking-[-0.03em] text-ink">
                In 30 Minuten prüfen, welche Anrufe heute hängen bleiben.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">
                Wir klären, welche Anrufarten sinnvoll sind, welche Pflichtinformationen fehlen und wann ein Mensch übernehmen muss.
              </p>
              <a
                href="mailto:hello@basemodul.de?subject=Telefonservice%20Handwerk%20pruefen"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leafbtn px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
              >
                Anrufannahme prüfen <PhoneCall size={16} />
              </a>
              <p className="mt-3 text-center text-[11px] text-inksoft">Unverbindlich. Erst ein Ablauf, dann Ausbau.</p>
            </div>
          </div>
        </section>

        <section id="fragen" className="border-t border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-16">
            <div>
              <h2 className="text-[34px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">
                Häufige Fragen zur Anrufannahme im Handwerk.
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
