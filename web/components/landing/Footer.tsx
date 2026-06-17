import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Produkt: [
    { label: "Funktionen", href: "/#features" },
    { label: "So funktioniert's", href: "/#how-it-works" },
    { label: "Preise", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  Unternehmen: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Karriere", href: "/karriere" },
    { label: "Kontakt", href: "/#cta" },
  ],
  Rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-12 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <Image
                src="/icon.svg"
                alt="AGENTEQ"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-2xl font-bold tracking-tight text-[#0369A1]">
                AGENTEQ
              </span>
            </Link>
            <p className="max-w-sm text-[15px] font-medium leading-relaxed text-slate-500">
              Der Anfrage-Assistent für kleine Betriebe. Nimmt Anrufe und Nachrichten an, erkennt Dringlichkeit und legt jede Anfrage sauber für Ihr Team bereit.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {title}
              </h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href as any}
                      className="text-[14px] font-bold text-slate-600 transition-colors hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-6 border-t border-slate-100 pt-8 sm:flex-row sm:justify-between">
          <p className="text-[13px] font-bold text-slate-400">
            Ein Produkt von <span className="text-slate-900">AGENTEQ</span>
          </p>
          <p className="text-[13px] font-bold text-slate-400">
            © {new Date().getFullYear()} AGENTEQ.
          </p>
        </div>
      </div>
    </footer>
  );
}
