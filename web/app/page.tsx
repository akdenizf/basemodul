import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ModulesSection } from "@/components/landing/ModulesSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { ScrollStorySection } from "@/components/landing/ScrollStorySection";
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

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-clip bg-paper text-ink">
      <Navbar />
      <main className="flex-1 pt-[60px]">
        <HeroSection />
        <ProblemSection />
        <StorySeam />
        <ModulesSection />
        <StorySeam />
        <UseCasesSection />
        <StorySeam />
        <WorkflowSection />
        <StorySeam />
        <ScrollStorySection />
        <StorySeam />
        <LiveDemoSection />
        <StorySeam />
        <VisualContextSection />
        <StorySeam />
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
