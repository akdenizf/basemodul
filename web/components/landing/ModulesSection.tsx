"use client";

import { motion, Variants } from "framer-motion";
import {
  CalendarCheck2,
  Camera,
  Check,
  MessageSquare,
  PhoneCall,
  Siren,
} from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const rowV: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

/* ── Artefakte: kleine interne Betriebsnotizen ─────────────────────────── */

function Field({
  label,
  value,
  valueClass = "text-ink",
  mono = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-dashed border-line pt-[7px] first:border-t-0 first:pt-0">
      <span className="text-[11px] text-faint">{label}</span>
      <span className={`text-[12px] font-medium ${mono ? "font-mono" : ""} ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

// Telefon — Rückrufnotiz
function RueckrufNotiz() {
  return (
    <div className="rounded-[10px] border border-line bg-paperdeep p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
          Rückrufnotiz
        </span>
        <span className="font-mono text-[10px] text-faint">22:47</span>
      </div>
      <div className="space-y-[7px]">
        <Field label="Name" value="Klaus M." />
        <Field label="Telefon" value="0176 24 …" mono />
        <Field label="Anliegen" value="Rückruf gewünscht" />
      </div>
    </div>
  );
}

// Notdienst — Übergabe mit Dringlichkeits-Markierung
function NotdienstUebergabe() {
  return (
    <div className="rounded-[10px] border border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.06)] p-3.5">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex items-center gap-1 rounded border border-[rgba(248,113,113,0.45)] bg-[rgba(220,38,38,0.14)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#FCA5A5]">
          <Siren size={11} strokeWidth={2.2} /> DRINGEND
        </span>
        <span className="font-mono text-[10px] text-faint">23:51</span>
      </div>
      <p className="mb-2.5 text-[12px] leading-snug text-label">
        Dringende Meldung außerhalb der Bürozeit.
      </p>
      <div className="flex items-center justify-between border-t border-dashed border-line pt-2">
        <span className="text-[11px] text-faint">Zuständig</span>
        <span className="font-mono text-[12px] font-medium text-ink">→ Bereitschaft</span>
      </div>
    </div>
  );
}

// Termin — zwei Zeitblöcke, einer grün markiert
function KalenderSlot() {
  return (
    <div className="rounded-[10px] border border-line bg-paperdeep p-3.5">
      <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
        Di, 24. Juni
      </p>
      <div className="space-y-2">
        <div className="rounded-[8px] border border-line px-3 py-2">
          <span className="block text-[10px] uppercase tracking-[0.08em] text-faint">Leistung</span>
          <span className="mt-0.5 block text-[12px] font-semibold text-ink">Vor-Ort-Termin</span>
        </div>
        <div className="flex items-center justify-between rounded-[8px] border border-line px-3 py-2">
          <span className="text-[12px] text-inksoft">09:00 – 10:00</span>
          <span className="text-[10px] text-faint">belegt</span>
        </div>
        <div className="flex items-center justify-between rounded-[8px] border border-leaf/60 bg-leafdim/50 px-3 py-2">
          <span className="text-[12px] font-semibold text-ink">14:30 – 15:30</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-leafbright">
            <Check size={11} strokeWidth={2.5} /> reserviert
          </span>
        </div>
      </div>
    </div>
  );
}

// WhatsApp — graue Bubble + Sortierung
function WhatsAppBubble() {
  return (
    <div className="rounded-[10px] border border-line bg-paperdeep p-3.5">
      <div className="max-w-[88%] rounded-2xl rounded-tl-[4px] border border-line bg-surface2 px-3.5 py-2.5">
        <p className="text-[12px] leading-snug text-label">
          Hallo, ich hätte eine Frage zu meinem Auftrag. Können Sie mich zurückrufen?
        </p>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 pl-1">
        <span className="rounded-md border border-leafdimline bg-leafdim px-2 py-0.5 text-[10px] font-semibold text-leafbright">
          Anfrage
        </span>
        <span className="rounded-md border border-line bg-paper px-2 py-0.5 text-[10px] text-inksoft">
          → ans Team
        </span>
      </div>
    </div>
  );
}

// Foto & Datei — strukturierte Mini-Übergabe
function FallkarteMini() {
  return (
    <div className="rounded-[10px] border border-line bg-paperdeep p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink">Anfrage mit Anhang</span>
        <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
          #A-204
        </span>
      </div>
      <div className="space-y-[7px]">
        <Field label="Kontakt" value="Thomas M." />
        <Field label="Status" value="vollständig" />
        <Field label="Priorität" value="Normal" valueClass="text-leafbright" />
      </div>
    </div>
  );
}

const modules = [
  {
    id: "01",
    Icon: PhoneCall,
    title: "Telefon-Modul",
    pitch: "Nimmt Anrufe an, erkennt das Anliegen, sichert Kontakt und Standort — das ist der Kern.",
    out: "Rückrufnotiz",
    Artifact: <RueckrufNotiz />,
  },
  {
    id: "02",
    Icon: Siren,
    title: "Notdienst-Modul",
    pitch: "Erkennt dringende Fälle im Anruf, fragt Pflichtinfos ab und alarmiert die Bereitschaft.",
    out: "Notfall eskaliert",
    Artifact: <NotdienstUebergabe />,
  },
  {
    id: "03",
    Icon: CalendarCheck2,
    title: "Termin-Modul",
    pitch: "Klärt Wunschzeit und Leistung im Anruf, bereitet Rückruf oder Buchung vor.",
    out: "Termin vorbereitet",
    Artifact: <KalenderSlot />,
  },
  {
    id: "04",
    Icon: MessageSquare,
    title: "WhatsApp-Modul",
    pitch: "Nimmt Rückfragen und Bestätigungen per Chat entgegen — als Ergänzung nach dem Anruf.",
    out: "Anfrage ans Team",
    Artifact: <WhatsAppBubble />,
  },
  {
    id: "05",
    Icon: Camera,
    title: "Foto-&-Datei-Modul",
    pitch: "Wenn nach dem Anruf ein Foto fehlt, sendet das Modul einen Upload-Link und verbindet alles.",
    out: "Strukturierte Übergabe",
    Artifact: <FallkarteMini />,
  },
];

export function ModulesSection() {
  return (
    <section id="modules" className="relative bg-paper py-20">
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.7fr] lg:gap-16">

          {/* Left — intro */}
          <div className="lg:sticky lg:top-[100px] lg:self-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              02 — Die Module
            </span>
            <h2 className="mt-4 mb-5 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
              Telefon zuerst.<br />Erweiterungen, wenn es mehr braucht.
            </h2>
            <p className="max-w-[360px] text-[16px] leading-[1.7] text-inksoft">
              Sie starten mit der Telefonannahme. WhatsApp, Fotos, Kalender und
              Webhooks kommen dazu, wenn der Ablauf sitzt.
            </p>
            <span className="mt-7 inline-flex items-center gap-[7px] rounded-full border border-leafdimline bg-leafdim px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.06em] text-leafbright">
              <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
              Eingang → Modul → Aktion
            </span>
          </div>

          {/* Right — module rack with real artifacts */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="glass-surface overflow-hidden rounded-xl"
          >
            {modules.map((m) => (
              <motion.div
                key={m.id}
                variants={rowV}
                className="group relative grid gap-5 border-b border-linesoft px-6 py-7 transition-colors duration-200 last:border-b-0 hover:bg-surface2 sm:grid-cols-[1fr_270px] sm:items-center sm:gap-8"
              >
                {/* left accent bar on hover */}
                <span className="absolute inset-y-0 left-0 w-0.5 scale-y-0 bg-leaf transition-transform duration-200 group-hover:scale-y-100" />

                {/* text block */}
                <div className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-line bg-paperdeep text-leaf">
                    <m.Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] font-semibold text-faint">{m.id}</span>
                      <h3 className="text-[17px] font-bold text-ink">{m.title}</h3>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-inksoft">{m.pitch}</p>
                  </div>
                </div>

                {/* artifact — the actual result */}
                <div className="w-full sm:shrink-0">
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    <span className="h-1 w-1 rounded-full bg-leafbright" /> Ergebnis
                  </p>
                  {m.Artifact}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
