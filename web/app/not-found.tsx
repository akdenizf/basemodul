import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | BaseModul",
  description: "Die angeforderte Seite wurde nicht gefunden.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
      <div className="max-w-xl rounded-2xl border border-linesoft bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-leaf">Fehler 404</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Diese Seite gibt es nicht.</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-inksoft">
          Der Link ist möglicherweise veraltet oder die Adresse wurde falsch eingegeben.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-leafbtn px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-leafbtnhover"
        >
          Zur BaseModul-Startseite
        </Link>
      </div>
    </main>
  );
}
