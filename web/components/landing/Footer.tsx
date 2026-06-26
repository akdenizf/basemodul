import Link from "next/link";

const footerLinks = {
  Produkt: [
    { label: "Module", href: "/#modules" },
    { label: "Demo", href: "/#livedemo" },
    { label: "Pilot", href: "/#pricing" },
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
    <footer className="border-t border-linesoft bg-paperdeep pb-9 pt-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="text-[16px] font-bold tracking-[0.08em] text-ink">
              BASEMODUL
            </Link>
            <p className="mt-4 max-w-[300px] text-[14px] leading-[1.7] text-inksoft">
              KI-Module für Betriebe: Telefon, Termine, WhatsApp, Fotos und
              Notfälle vorsortieren und sauber ans Team übergeben.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.1em] text-faint">
                {title}
              </h5>
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href as any}
                      className="block py-[7px] text-[14px] text-inksoft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-linesoft pt-7 text-[13px] text-faint sm:flex-row sm:justify-between">
          <span>Ein Produkt von AGENTEQ</span>
          <span>© {new Date().getFullYear()} BASEMODUL</span>
        </div>
      </div>
    </footer>
  );
}
