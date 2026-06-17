import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { BranchenSection } from "@/components/landing/BranchenSection";
import { PainSection } from "@/components/landing/PainSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SelfOnboardingSection } from "@/components/landing/SelfOnboardingSection";
import { VisualContextSection } from "@/components/landing/VisualContextSection";
import { RoiSection } from "@/components/landing/RoiSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LetsWorkTogether } from "@/components/landing/LetsWorkTogether";
import { Footer } from "@/components/landing/Footer";
import { FloatingCta } from "@/components/landing/FloatingCta";

const LiveDemoSection = dynamic(
  () => import("@/components/landing/LiveDemoSection").then((m) => ({ default: m.LiveDemoSection })),
  { ssr: false, loading: () => <div className="py-24 sm:py-32 bg-[#F8FAFC]" /> }
);

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#F8FAFC] text-slate-900 selection:bg-[#0369A1]/30">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <LiveDemoSection />
        <BranchenSection />
        <PainSection />
        <HowItWorksSection />
        <SelfOnboardingSection />
        <VisualContextSection />
        <RoiSection />
        <IntegrationsSection />
        <PricingSection />
        <LetsWorkTogether />
      </main>
      <FaqSection />
      <Footer />
      <FloatingCta />
    </div>
  );
}
