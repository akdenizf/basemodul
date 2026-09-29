import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileImage,
  Gauge,
  ListChecks,
  MapPin,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { faqs, structuredData } from "./seo-data";

export const metadata: Metadata = {
  title: "Kundenanfragen qualifizieren im Handwerk | BaseModul",
  description:
    "Welche Pflichtinformationen Handwerksbetriebe brauchen, um Anfragen zu priorisieren, Rückrufe vorzubereiten und den nächsten Schritt sicher zu entscheiden.",
  alternates: {
    canonical: "/kundenanfragen-qualifizieren-handwerk",
  },
  openGraph: {
    title: "Kundenanfragen qualifizieren im Handwerk | BaseModul",
    description:
      "Pflichtfelder, Priorität, Zuständigkeit und menschlicher Fallback: So werden Kundenanfragen im Handwerk bearbeitbar.",
    url: "/kundenanfragen-qualifizieren-handwerk",
    siteName: "BaseModul",
    locale: "de_DE",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Kundenanfragen qualifizieren im Handwerk | BaseModul",
    description:
      "Ein praktischer Prozess für Pflichtinformationen, Priorisierung und Übergabe von Kundenanfragen im Handwerk.",
  },
};

const requiredFields = [
  [UserCheck, "Kontakt", "Wer ist erreichbar und wann ist ein Rückruf sinnvoll?"],
  [MapPin, "Einsatzort", "Wo findet der Fall statt und welches Objekt ist betroffen?"],
  [Wrench, "Anliegen", "Was ist passiert, welches Gewerk oder Thema ist gemeint?"],
  [Gauge, "Dringlichkeit", "Was spricht für normalen Rückruf, zeitnahe Prüfung oder Eskalation?"],
  [FileImage, "Unterlagen", "Gibt es Fotos, Dokumente, Rechnungen oder Vorinformationen?"],
  [ClipboardCheck, "Nächster Schritt", "Rückruf, Termin, Angebot, Nachforderung oder menschliche Prüfung?"],
] as const;

const prioritySignals = [
  ["vollständig", "Kontakt, Ort, Anliegen und nächster Schritt sind klar genug für die Bearbeitung."],
  ["nachfragen", "Ein wichtiges Pflichtfeld fehlt; der Vorgang braucht eine gezielte Rückfrage."],
  ["prüfen", "Dringlichkeit, Zuständigkeit oder fachliche Bewertung ist unklar und gehört zu einem Menschen."],
];

const articleSteps = [
  ["Pflichtfelder definieren", "Legen Sie fest, welche Angaben Ihr Team vor Rückruf, Angebot oder Termin braucht."],
  ["Eingänge vereinheitlichen", "Telefon, WhatsApp, Web und Fotos sollten in derselben Übergabelogik enden."],
  ["Priorität nachvollziehbar machen", "Dringlichkeit wird nicht geraten, sondern aus vereinbarten Signalen abgeleitet."],
  ["Korrekturen messen", "Wenn Ihr Team häufig nachbessert, ist das ein Signal für fehlende Pflichtfelder."],
];

export default function QualifyCraftRequestsPage() {
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
            <a href="#pflichtfelder" className="transition-colors hover:text-leaf">Pflichtfelder</a>
            <a href="#prioritaet" className="transition-colors hover:text-leaf">Priorität</a>
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
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_.95fr] lg:gap-16">
            <div>
              <h1 className="max-w-[840px] text-[clamp(40px,6.1vw,68px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink">
                Kundenanfragen qualifizieren, damit Ihr Team den nächsten Schritt kennt.
              </h1>
              <p className="mt-6 max-w-[670px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
                Gute Anfragequalifizierung heißt nicht “alles automatisieren”. Es heißt: Pflichtinformationen vollständig erfassen, Zuständigkeit klären, Priorität nachvollziehbar machen und unklare Fälle an Menschen übergeben.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pflichtfelder"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
                >
                  Pflichtfelder ansehen <ArrowRight size={16} />
                </a>
                <Link
                  href="/kundenanfragen-handwerk-automatisieren"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-leaf hover:bg-[#F8FAF6]"
                >
                  Anfrageprozess lesen
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft">
                <span className="inline-flex items-center gap-1.5"><ListChecks size={14} className="text-leaf" /> Pflichtfelder vor Rückruf</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leaf" /> Menschliche Prüfung bei Grenzfällen</span>
              </div>
            </div>

            <div className="work-paper rounded-[6px] p-4 sm:p-6">
              <div className="rounded-[6px] border border-[#D9D8CF] bg-white p-4">
                <div className="flex items-center justify-between border-b border-linesoft pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-leaf text-white">
                      <MessageSquare size={19} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">Vorher</p>
                      <h2 className="text-[16px] font-extrabold text-ink">“Können Sie mal schauen?”</h2>
                    </div>
                  </div>
                  <span className="rounded-[4px] border border-[#E5C8AB] bg-[#FCF0E5] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#A75420]">
                    unklar
                  </span>
                </div>
                <div className="mt-4 grid gap-3">
                  {["Kontakt fehlt", "Ort unklar", "Dringlichkeit nicht bewertet", "Nächster Schritt offen"].map((item) => (
                    <div key={item} className="rounded-[5px] border border-[#E5C8AB] bg-[#FCF0E5] px-3 py-2 text-[13px] font-semibold text-ink">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[6px] bg-forestdeep p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-white/60">Nachher</p>
                <h2 className="mt-1 text-[22px] font-extrabold leading-tight">Bearbeitbarer Vorgang mit nächstem Schritt.</h2>
                <div className="mt-4 grid gap-2">
                  {["Rückruf heute", "Fotos angefordert", "Team SHK informiert"].map((item) => (
                    <p key={item} className="flex items-center gap-2 text-[13px] font-semibold text-[#BDE0BE]">
                      <CheckCircle2 size={15} /> {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pflichtfelder" className="border-y border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="max-w-[780px] text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
              Eine Anfrage ist erst brauchbar, wenn die Pflichtfelder vorliegen.
            </h2>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requiredFields.map(([Icon, title, text]) => (
                <div key={title} className="rounded-[7px] border border-line bg-white p-6 shadow-[0_12px_30px_-26px_rgba(31,42,35,0.38)]">
                  <Icon size={23} className="text-leaf" />
                  <h3 className="mt-5 text-[18px] font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-inksoft">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="prioritaet" className="px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(31px,4vw,47px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
                Priorität ist kein Gefühl. Sie braucht sichtbare Signale.
              </h2>
              <p className="mt-5 max-w-[500px] text-[15px] leading-relaxed text-inksoft">
                BaseModul hilft, Anfragen nach Vollständigkeit und vereinbarten Regeln vorzubereiten. Was fachlich kritisch ist, entscheidet nicht die Seite und nicht ein pauschaler Bot.
              </p>
            </div>
            <div className="overflow-hidden rounded-[7px] border border-line bg-white">
              {prioritySignals.map(([label, text], index) => (
                <div key={label} className={`grid gap-3 px-5 py-5 sm:grid-cols-[180px_1fr] ${index !== prioritySignals.length - 1 ? "border-b border-linesoft" : ""}`}>
                  <p className="text-[14px] font-bold text-ink">{label}</p>
                  <p className="text-[14px] leading-relaxed text-inksoft">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-linesoft bg-paperdeep px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-[31px] font-extrabold leading-[1.13] tracking-[-0.03em] text-ink">
                Der Ablauf wird besser, wenn echte Korrekturen zurückfließen.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">
                Wenn Ihr Team regelmäßig Ort, Dringlichkeit oder Zuständigkeit korrigieren muss, ist das kein Fehler einzelner Mitarbeitender. Es ist ein Hinweis, dass der Anfrageprozess nachgeschärft werden sollte.
              </p>
            </div>
            <div className="grid gap-3">
              {articleSteps.map(([title, text], index) => (
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

        <section id="check" className="px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[8px] border border-line bg-white p-7 shadow-[0_18px_38px_-30px_rgba(31,42,35,0.35)] sm:p-9">
              <h2 className="text-[31px] font-extrabold leading-[1.13] tracking-[-0.03em] text-ink">
                Beginnen Sie mit einem Anfragefall, der heute oft unvollständig ankommt.
              </h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Telefonnotizen ohne Ort oder Anlass",
                  "WhatsApp-Nachrichten mit Foto, aber ohne Kontext",
                  "Web-Anfragen ohne Zuständigkeit",
                  "Rückrufe, die mit Nachfragen statt Entscheidung beginnen",
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
                In 30 Minuten die wichtigsten Pflichtfelder klären.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">
                Wir prüfen, wo Anfragen heute unvollständig werden und welcher kleine Pilot daraus einen besseren Vorgang machen kann.
              </p>
              <a
                href="mailto:hello@basemodul.de?subject=Kundenanfragen%20qualifizieren%20Handwerk"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leafbtn px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
              >
                Anfragequalität prüfen <ArrowUpRight size={16} />
              </a>
              <p className="mt-3 text-center text-[11px] text-inksoft">Unverbindlich. Erst Pflichtfelder, dann Automatisierung.</p>
            </div>
          </div>
        </section>

        <section id="fragen" className="border-t border-linesoft bg-paper2 px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-16">
            <div>
              <h2 className="text-[34px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink">
                Häufige Fragen zur Anfragequalifizierung.
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
