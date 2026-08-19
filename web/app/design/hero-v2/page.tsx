import { HeroSection } from "@/components/landing/HeroSection";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function HeroV2DesignPreview() {
  return (
    <main>
      <div className="border-b border-line bg-inkdeep px-6 py-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-signaldim">
        Design-Review · Hero v2 (jetzt live auf der Startseite) · nicht verlinkt
      </div>
      <HeroSection />
    </main>
  );
}
