import Link from "next/link";
import { ArrowRight } from "lucide-react";

const solutions = [
  {
    href: "/kundenanfragen-handwerk-automatisieren",
    title: "Anfrageprozess automatisieren",
    description: "Telefon, WhatsApp, Web und Fotos in einen klaren Anfrageprozess überführen.",
  },
  {
    href: "/ki-telefonassistent-shk",
    title: "KI-Telefonassistent für SHK",
    description: "Anfragen aufnehmen und mit vereinbarten Pflichtfeldern an das Team übergeben.",
  },
  {
    href: "/whatsapp-bot-handwerk",
    title: "WhatsApp-Anfragen strukturieren",
    description: "Nachrichten, Fotos und fehlende Angaben zu einem bearbeitbaren Vorgang bündeln.",
  },
  {
    href: "/telefonservice-handwerk",
    title: "Telefonservice fürs Handwerk",
    description: "Anrufe nach klaren Regeln erfassen und einen menschlichen Rückruf vorbereiten.",
  },
  {
    href: "/kundenanfragen-qualifizieren-handwerk",
    title: "Kundenanfragen qualifizieren",
    description: "Pflichtfelder, Priorisierung und Zuständigkeiten für den nächsten Schritt klären.",
  },
] as const;

export function RelatedSolutions({ currentPath }: { currentPath: string }) {
  const related = solutions.filter((solution) => solution.href !== currentPath);

  return (
    <section aria-labelledby="related-solutions-heading" className="border-t border-linesoft bg-paper px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <p className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
          Weitere Lösungen und Grundlagen
        </p>
        <h2 id="related-solutions-heading" className="mt-5 max-w-[720px] text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink">
          Den passenden Einstieg für Ihren Anfrageprozess finden.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((solution) => (
            <Link
              key={solution.href}
              href={solution.href}
              className="group flex min-h-[180px] flex-col rounded-[8px] border border-line bg-white p-5 shadow-[0_12px_30px_-28px_rgba(31,42,35,0.35)] transition hover:border-[#A8C2AA]"
            >
              <h3 className="text-[17px] font-bold text-ink">{solution.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-inksoft">{solution.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-bold text-leaf">
                Mehr erfahren <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
