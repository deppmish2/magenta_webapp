import { useState } from "react";
import { StickyNav } from "./components/StickyNav";
import { HeroSection } from "./components/HeroSection";
import { ValuePillarsSection } from "./components/ValuePillarsSection";
import { IndustryUseCaseExplorer } from "./components/IndustryUseCaseExplorer";
import { AIDemoSection } from "./components/AIDemoSection";
import { ArchitectureSection } from "./components/ArchitectureSection";
import { GovernanceSection } from "./components/GovernanceSection";
import { DeliveryJourneySection } from "./components/DeliveryJourneySection";
import { FinalCTASection } from "./components/FinalCTASection";
import {
  getDefaultPromptForMode,
  modeBackgroundClasses,
  modePanelClasses,
  modeThemes,
  promptById,
} from "./data/demoContent";
import { cn } from "./lib/utils";
import type { DemoMode } from "./types";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "use-cases", label: "Use Cases" },
  { id: "demo", label: "Demo" },
  { id: "architecture", label: "Architecture" },
  { id: "governance", label: "Governance" },
  { id: "journey", label: "Journey" },
];

export default function App() {
  const [mode, setMode] = useState<DemoMode>("enterprise");
  const [promptId, setPromptId] = useState(getDefaultPromptForMode("enterprise").id);

  const theme = modeThemes[mode];

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleModeChange(next: DemoMode) {
    setMode(next);
    setPromptId(getDefaultPromptForMode(next).id);
  }

  function handlePromptChange(next: string) {
    setPromptId(next);
    const nextMode = promptById[next]?.mode;
    if (nextMode) setMode(nextMode);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-white">
      {/* Global background gradient shifts with mode */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[680px] opacity-90 transition-all duration-700",
          modeBackgroundClasses[mode],
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,10,0.06),rgba(5,3,10,0.92))]" />

      <StickyNav
        mode={mode}
        theme={theme}
        items={NAV}
        onDemoClick={() => scrollTo("demo")}
        onModeChange={handleModeChange}
        showModeSwitch={false}
        subtitle="T-Systems AI & Data"
      />

      <main className="app-shell">

        {/* 1. HERO */}
        <HeroSection
          onLaunchDemo={() => scrollTo("demo")}
          onExploreUseCases={() => scrollTo("use-cases")}
          onViewArchitecture={() => scrollTo("architecture")}
        />

        {/* 2. VALUE PILLARS */}
        <ValuePillarsSection />

        {/* 3. INDUSTRY USE CASE EXPLORER */}
        <IndustryUseCaseExplorer />

        {/* 4. AI DEMO */}
        <AIDemoSection
          mode={mode}
          promptId={promptId}
          onModeChange={handleModeChange}
          onPromptChange={handlePromptChange}
        />

        {/* 5. ARCHITECTURE */}
        <ArchitectureSection mode={mode} promptId={promptId} />

        {/* 6. GOVERNANCE */}
        <GovernanceSection />

        {/* 7. DELIVERY JOURNEY */}
        <DeliveryJourneySection />

        {/* 8. FINAL CTA */}
        <FinalCTASection onStartTransformation={() => scrollTo("demo")} />

      </main>
    </div>
  );
}
