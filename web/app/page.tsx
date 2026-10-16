import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { RequestArtifactSection } from "@/components/landing/RequestArtifactSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { ModulesSection } from "@/components/landing/ModulesSection";
import { StorySeam } from "@/components/landing/StorySeam";
import { VisualContextSection } from "@/components/landing/VisualContextSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LetsWorkTogether } from "@/components/landing/LetsWorkTogether";
import { Footer } from "@/components/landing/Footer";
import { FloatingCta } from "@/components/landing/FloatingCta";

const LiveDemoSection = dynamic(
  () => import("@/components/landing/LiveDemoSection").then((m) => ({ default: m.LiveDemoSection })),
  { ssr: false, loading: () => <div className="py-16 bg-paper" /> }
);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.basemodul.de/#organization",
      name: "BaseModul",
      url: "https://www.basemodul.de",
      description:
        "BaseModul strukturiert Kundenanfragen aus Telefon, WhatsApp, Web und Fotos für lokale Service- und Handwerksbetriebe.",
      founder: {
        "@type": "Person",
        name: "Fatih Mehmet Akdeniz",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.basemodul.de/#website",
      url: "https://www.basemodul.de",
      name: "BaseModul",
      inLanguage: "de-DE",
      publisher: { "@id": "https://www.basemodul.de/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.basemodul.de/#webpage",
      url: "https://www.basemodul.de/",
      name: "BaseModul | Kundenanfragen für Handwerksbetriebe strukturieren",
      description:
        "BaseModul bringt Telefon, WhatsApp, Web-Anfragen und Fotos in einen strukturierten Vorgang für lokale Servicebetriebe.",
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://www.basemodul.de/#website" },
      about: { "@id": "https://www.basemodul.de/#organization" },
    },
  ],
};

export const metadata: Metadata = {
  title: "BaseModul | Kundenanfragen für Handwerksbetriebe strukturieren",
  description:
    "BaseModul bringt Telefon, WhatsApp, Web-Anfragen und Fotos in einen strukturierten Vorgang für lokale Servicebetriebe.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BaseModul | Aus Anfragen werden klare nächste Schritte",
    description:
      "Kundenanfragen aus Telefon, WhatsApp, Web und Fotos strukturiert aufnehmen, qualifizieren und an Ihr Team übergeben.",
    url: "/",
    siteName: "BaseModul",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "BaseModul | Aus Anfragen werden klare nächste Schritte",
    description:
      "Kundenanfragen aus Telefon, WhatsApp, Web und Fotos strukturiert aufnehmen, qualifizieren und an Ihr Team übergeben.",
  },
};

// Dramaturgie: Pain → fertiger Vorgang → Beispiele → Module → Demo → Pilot
// (siehe docs/content/basemodul-landing-choreography-2026-07-16.md)
export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-clip bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="flex-1 pt-[60px]">
        <HeroSection />
        <RequestArtifactSection />
        <ProblemSection />
        <StorySeam />
        <UseCasesSection />
        <ModulesSection />
        <StorySeam />
        <LiveDemoSection />
        <VisualContextSection />
        <IntegrationsSection />
        <StorySeam />
        <PricingSection />
        <FaqSection />
        <LetsWorkTogether />
      </main>
      <Footer />
      <FloatingCta />
    </div>
  );
}
