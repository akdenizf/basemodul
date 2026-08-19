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
  PhoneIncoming,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "KI-Telefonassistent für SHK-Betriebe | BaseModul",
  description:
    "BaseModul nimmt SHK-Anfragen strukturiert auf, fragt Pflichtinfos ab und übergibt Rückrufe oder Notfälle verlässlich an Ihr Team.",
};

const pilotSteps = [
  {
    number: "01",
    title: "Einen Eingang festlegen",
    text: "Wir starten dort, wo Anfragen heute liegen bleiben: meist Telefon, bei Bedarf ergänzt um WhatsApp oder Website.",
  },
  {
    number: "02",
    title: "Pflichtinfos sauber abfragen",
    text: "Anliegen, Adresse, Rückrufnummer, Heizungstyp und Dringlichkeit kommen vollständig bei Ihrem Team an.",
  },
  {
    number: "03",
    title: "30 Tage im Alltag prüfen",
    text: "Sie sehen nicht eine KI-Demo, sondern vollständige Übergaben, Rückrufe und klare nächste Schritte aus Ihrem Betrieb.",
  },
];

const scorecardRows = [
  ["Relevante Eingänge", "Wie viele Anfragen kommen im gewählten Kanal tatsächlich an?"],
  ["Nicht angenommene Anrufe", "Welche Anfragen hätte Ihr Team ohne Übergabe nicht erreicht?"],
  ["Vollständige Übergaben", "Enthält die Anfrage Kontakt, Ort, Anliegen und die vereinbarten Pflichtfelder?"],
  ["Zeit bis zur Übergabe", "Wie schnell liegt die Anfrage bei der zuständigen Person?"],
  ["Rückruf- oder Terminquote", "Wie viele qualifizierte Anfragen erhalten einen konkreten nächsten Schritt?"],
];

const faqs = [
  {
    question: "Ersetzt BaseModul unsere Disposition oder Rezeption?",
    answer:
      "Nein. BaseModul übernimmt die strukturierte erste Aufnahme der Anfragen, die heute durchfallen – etwa während Einsätzen, außerhalb der Erreichbarkeit oder bei hoher Auslastung. Zuständigkeit und Fachentscheidung bleiben bei Ihrem Team.",
  },
  {
    question: "Müssen wir unsere bestehende Nummer ändern?",
    answer:
      "Nein. Für einen Pilot kann eine Testnummer genutzt werden. Später lässt sich die bestehende Nummer nach klaren Regeln weiterleiten, zum Beispiel außerhalb Ihrer Bürozeit oder nach einer festgelegten Zahl an Klingelzeichen.",
  },
  {
    question: "Entscheidet der Assistent, ob ein Notfall vorliegt?",
    answer:
      "Er arbeitet nach vorher vereinbarten Signalen und fragt die erforderlichen Informationen ab. Kritische Fälle werden nach Ihrer Eskalationsregel an eine menschliche Bereitschaft oder zuständige Person weitergeleitet; fachlich verbindliche Entscheidungen bleiben beim Betrieb.",
  },
  {
    question: "Was kostet der Einstieg?",
    answer:
      "Der klar abgegrenzte Pilot startet ab 750 € Setup. Laufende Kosten hängen vom Eingangskanal, der Betreuung und gegebenenfalls Telefonie oder Messaging ab. Vor dem Start sind Umfang und Kosten transparent definiert.",
  },
];

export default function ShkIntakePage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-[15px] font-bold tracking-[0.1em] text-ink">
            BASEMODUL
          </Link>
          <div className="hidden items-center gap-6 text-[13px] font-medium text-label sm:flex">
            <a href="#ablauf" className="transition-colors hover:text-ink">So funktioniert&apos;s</a>
            <a href="#pilot" className="transition-colors hover:text-ink">30-Tage-Pilot</a>
            <a href="#fragen" className="transition-colors hover:text-ink">Fragen</a>
          </div>
          <a
            href="#check"
            className="inline-flex items-center gap-2 rounded-lg bg-leafbtn px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
          >
            30-Minuten-Check
            <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-[132px] sm:pb-24 lg:pt-[160px]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 68% at 50% 20%, #000 0%, transparent 76%)",
              maskImage:
                "radial-gradient(ellipse 90% 68% at 50% 20%, #000 0%, transparent 76%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse 62% 65% at 55% 0%, rgba(34,197,94,0.11) 0%, transparent 72%)",
            }}
          />

          <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-leafdimline bg-leafdim px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-leafbright">
                <Wrench size={13} strokeWidth={2.25} />
                Für SHK-Betriebe in München & Umgebung
              </div>
              <h1 className="mt-6 max-w-[700px] text-[clamp(40px,7vw,72px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink">
                Wenn niemand ans Telefon geht, <span className="text-green-400">geht der Auftrag oft weiter.</span>
              </h1>
              <p className="mt-6 max-w-[620px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
                BaseModul nimmt Anfragen für Heizung, Sanitär und Klima strukturiert auf, fragt die Pflichtinfos ab und übergibt Ihrem Team einen klaren nächsten Schritt – statt Mailbox, Zettel oder unvollständiger WhatsApp-Nachricht.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#check"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover"
                >
                  30-Minuten-Check buchen
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#beispiel"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 px-7 py-3.5 text-[15px] font-semibold text-label transition hover:border-white/30 hover:bg-white/[0.04] hover:text-ink"
                >
                  Beispiel-Anfrage ansehen
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-faint">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leafbright" /> Klare menschliche Übergaben</span>
                <span className="inline-flex items-center gap-1.5"><ClipboardCheck size={14} className="text-leafbright" /> 30 Tage messbar prüfen</span>
              </div>
            </div>

            <div id="beispiel" className="relative mx-auto w-full max-w-[520px] rounded-[28px] border border-white/[0.1] bg-[#121212] p-4 shadow-[0_30px_80px_-32px_rgba(0,0,0,0.95)] sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-leafdimline bg-leafdim text-leafbright"><PhoneIncoming size={19} /></span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Neue Anfrage für Ihr Team</p>
                    <p className="mt-0.5 text-[14px] font-semibold text-ink">Heizung ausgefallen · Rückruf benötigt</p>
                  </div>
                </div>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold text-amber-200">HOCH</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint"><User size={12} /> Kontakt & Ort</p>
                  <p className="mt-2 text-[14px] font-semibold text-ink">Frau Schneider</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-inksoft">80331 München · 0176 24•• •••</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint"><AlertTriangle size={12} /> Anliegen</p>
                  <p className="mt-2 text-[14px] font-semibold text-ink">Heizung kalt seit heute Morgen</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-inksoft">Mehrfamilienhaus · Anlage unbekannt</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint"><Camera size={12} /> Anhänge</p>
                  <p className="mt-2 text-[14px] font-semibold text-ink">2 Fotos angefordert</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-inksoft">WhatsApp-Link bereit</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint"><Clock3 size={12} /> Eingang</p>
                  <p className="mt-2 text-[14px] font-semibold text-ink">22:47 Uhr</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-inksoft">Außerhalb der Bürozeit</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-leafdimline bg-leafdim/45 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-leafbright">Nächster Schritt</p>
                <p className="mt-1 text-[15px] font-bold text-ink">Bereitschaft ruft zurück.</p>
                <p className="mt-1.5 text-[12px] text-inksoft">Übergabe per E-Mail und WhatsApp an die vereinbarte Rufbereitschaft.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#0d0d0d] px-6 py-14 sm:py-18">
          <div className="mx-auto max-w-[1200px]">
            <div className="max-w-[670px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leafbright">Der Engpass im Alltag</p>
              <h2 className="mt-3 text-[clamp(29px,4vw,45px)] font-extrabold leading-[1.12] tracking-[-0.035em] text-ink">Der Erstkontakt passiert genau dann, wenn Ihr Team nicht am Schreibtisch sitzt.</h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                ["Auf der Baustelle", "Ein Anruf erreicht niemanden, weil Fachpersonal beim Kunden ist."],
                ["Außerhalb der Bürozeit", "Der Interessent landet in der Mailbox, obwohl der Anlass nicht bis morgen warten soll."],
                ["Unvollständige Anfrage", "Adresse, Anlage, Fotos oder Dringlichkeit fehlen – und der Rückruf beginnt wieder bei null."],
              ].map(([title, text], index) => (
                <div key={title} className="rounded-2xl border border-white/[0.09] bg-[#141414] p-5">
                  <span className="font-mono text-[11px] font-bold text-leafbright">0{index + 1}</span>
                  <h3 className="mt-5 text-[18px] font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-inksoft">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ablauf" className="px-6 py-18 sm:py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leafbright">Ein sauberer Einstieg</p>
                <h2 className="mt-3 text-[clamp(29px,4vw,45px)] font-extrabold leading-[1.12] tracking-[-0.035em] text-ink">Nicht gleich alles automatisieren. Erst eine Anfrage zuverlässig in Arbeit verwandeln.</h2>
                <p className="mt-5 max-w-[440px] text-[15px] leading-relaxed text-inksoft">Der Pilot ist bewusst klein. Er schafft einen verlässlichen Eingang und einen klaren Team-Übergabepunkt. Terminierung, Foto-Erfassung und weitere Module folgen erst, wenn sie im Alltag wirklich helfen.</p>
              </div>
              <div className="grid gap-3">
                {pilotSteps.map((step) => (
                  <div key={step.number} className="group flex gap-5 rounded-2xl border border-white/[0.08] bg-[#141414] p-5 transition hover:border-leafdimline hover:bg-[#181818]">
                    <span className="font-mono text-[12px] font-bold text-leafbright">{step.number}</span>
                    <div>
                      <h3 className="text-[17px] font-bold text-ink">{step.title}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-inksoft">{step.text}</p>
                    </div>
                    <ChevronRight size={18} className="ml-auto mt-1 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-leafbright" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pilot" className="border-y border-white/[0.07] bg-[#0d0d0d] px-6 py-18 sm:py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-[700px]">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leafbright">30-Tage-Pilot mit Scorecard</p>
                <h2 className="mt-3 text-[clamp(29px,4vw,45px)] font-extrabold leading-[1.12] tracking-[-0.035em] text-ink">Keine diffuse KI-Demo. Ein Ablauf, den Sie im Betrieb prüfen können.</h2>
              </div>
              <p className="max-w-[330px] text-[14px] leading-relaxed text-inksoft">Wir berichten Wirkung, nicht Versprechen. Wenn eine Kennzahl bei Ihnen nicht sauber vorliegt, wird sie als nicht verfügbar markiert – nicht geschätzt.</p>
            </div>

            <div className="mt-9 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#141414]">
              <div className="grid grid-cols-[minmax(132px,0.65fr)_1.35fr] border-b border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-faint sm:grid-cols-[0.7fr_1.8fr]"><span>Kennzahl</span><span>Was sie zeigt</span></div>
              {scorecardRows.map(([metric, explanation], index) => (
                <div key={metric} className={`grid grid-cols-[minmax(132px,0.65fr)_1.35fr] gap-4 px-4 py-4 sm:grid-cols-[0.7fr_1.8fr] ${index !== scorecardRows.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                  <p className="text-[13px] font-bold text-ink">{metric}</p>
                  <p className="text-[13px] leading-relaxed text-inksoft">{explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-18 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.03fr_0.97fr]">
            <div className="rounded-3xl border border-white/[0.1] bg-[#141414] p-7 sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leafbright">Was im Pilot enthalten ist</p>
              <h2 className="mt-3 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">Ein Eingangskanal. Ein sauberer Ablauf. Echte Fälle.</h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Klarer Fragenkatalog für Ihre typischen SHK-Anfragen",
                  "Vereinbarte Pflichtfelder und menschliche Übergaben",
                  "Testfälle für Normalfall, unvollständige Anfrage und kritischen Fall",
                  "Wöchentlicher Blick auf die Pilot-Scorecard",
                  "Abschlussgespräch mit klarer Ausbau-, Nachschärfungs- oder Pause-Entscheidung",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-inksoft"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-leafbright" />{item}</li>
                ))}
              </ul>
            </div>
            <div id="check" className="rounded-3xl border border-leafdimline bg-gradient-to-b from-leafdim/70 to-[#121812] p-7 sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leafbright">Der nächste Schritt</p>
              <h2 className="mt-3 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">In 30 Minuten den größten Anfrage-Engpass finden.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">Wir klären, welcher Eingangskanal heute Anfragen verliert, welche Pflichtinfos Ihr Team wirklich braucht und ob ein schlanker Pilot dafür sinnvoll ist.</p>
              <div className="mt-8 rounded-xl border border-white/[0.09] bg-black/15 p-4 text-[13px] text-inksoft">
                <p className="font-bold text-ink">Start ab 750 € Setup</p>
                <p className="mt-1.5 leading-relaxed">Der konkrete Umfang, laufende Kosten und die Datenverarbeitung werden vor dem Pilot transparent festgelegt.</p>
              </div>
              <a href="mailto:hello@basemodul.de?subject=30-Minuten-Check%20SHK" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leafbtn px-6 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-leafbtnhover">
                30-Minuten-Check anfragen
                <ArrowUpRight size={16} />
              </a>
              <p className="mt-3 text-center text-[11px] text-faint">Unverbindlich. Kein Komplettsystem im Erstgespräch.</p>
            </div>
          </div>
        </section>

        <section id="fragen" className="border-t border-white/[0.07] px-6 py-18 sm:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leafbright">Häufige Fragen</p>
              <h2 className="mt-3 text-[32px] font-extrabold leading-[1.15] tracking-[-0.035em] text-ink">Klarheit vor dem Start.</h2>
            </div>
            <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-[#141414] px-5 sm:px-7">
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

      <footer className="border-t border-white/[0.07] bg-[#0d0d0d] px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-[12px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-bold tracking-[0.08em] text-ink">BASEMODUL</span> · Ein Produkt von AGENTEQ</p>
          <div className="flex gap-5"><Link href="/impressum" className="hover:text-ink">Impressum</Link><Link href="/datenschutz" className="hover:text-ink">Datenschutz</Link><Link href="/" className="hover:text-ink">Zur Startseite</Link></div>
        </div>
      </footer>
    </div>
  );
}
