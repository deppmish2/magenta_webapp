import { motion } from "framer-motion";
import { BrainCircuit, Database, ShieldAlert } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { LiveAnswerPanel } from "./LiveAnswerPanel";
import { AIQualityMonitor } from "./AIQualityMonitor";
import { modePanelClasses, modeThemes, getDefaultPromptForMode } from "../data/demoContent";
import { cn } from "../lib/utils";
import type { DemoMode } from "../types";

interface DemoModeConfig {
  id: DemoMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEMO_MODES: DemoModeConfig[] = [
  {
    id: "consumer",
    label: "Executive Copilot",
    description: "Strategic AI guidance for executive decision-making — opportunity identification, roadmaps, and business case framing.",
    icon: BrainCircuit,
  },
  {
    id: "enterprise",
    label: "Talk to Your Data",
    description: "Governed access to enterprise data — synthesising operational metrics, CRM insights, and knowledge bases into structured answers.",
    icon: Database,
  },
  {
    id: "architect",
    label: "Sovereign AI Advisor",
    description: "Governance-centric guidance on deployment readiness, compliance posture, data residency, and human-in-the-loop controls.",
    icon: ShieldAlert,
  },
];

interface AIDemoSectionProps {
  mode: DemoMode;
  promptId: string;
  onModeChange: (mode: DemoMode) => void;
  onPromptChange: (promptId: string) => void;
}

export function AIDemoSection({
  mode,
  promptId,
  onModeChange,
  onPromptChange,
}: AIDemoSectionProps) {
  const theme = modeThemes[mode];

  function handleModeSelect(next: DemoMode) {
    onModeChange(next);
    onPromptChange(getDefaultPromptForMode(next).id);
  }

  return (
    <SectionWrapper
      id="demo"
      eyebrow="Interactive Demo"
      title="See MagentAI in Action"
      description="Select a demo mode to experience how MagentAI responds across executive, data, and governance contexts."
      tintClassName={modePanelClasses[mode]}
    >
      {/* Mode selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {DEMO_MODES.map((dm) => {
          const active = dm.id === mode;
          const Icon = dm.icon;
          return (
            <button
              key={dm.id}
              type="button"
              onClick={() => handleModeSelect(dm.id)}
              className={cn(
                "rounded-[24px] border p-5 text-left transition-all duration-300",
                active
                  ? "border-white/25 bg-white/[0.10] shadow-glow"
                  : "border-white/10 bg-white/[0.04] hover:border-white/18 hover:bg-white/[0.07]",
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    "rounded-xl border p-2 transition-colors",
                    active
                      ? "border-magenta-300/30 bg-magenta-500/15 text-magenta-100"
                      : "border-white/10 bg-white/5 text-white/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.3em]",
                    active ? "text-magenta-200" : "text-white/40",
                  )}
                >
                  {dm.label}
                </p>
              </div>
              <p className="text-sm leading-6 text-white/60">{dm.description}</p>
            </button>
          );
        })}
      </motion.div>

      {/* Active mode description strip */}
      <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-magenta-200/70">
          Active Mode &mdash; {DEMO_MODES.find((d) => d.id === mode)?.label}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/62">{theme.demoCallout}</p>
      </div>

      {/* Live answer panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <LiveAnswerPanel promptId={promptId} onPromptChange={onPromptChange} />
      </motion.div>

      {/* Quality & observability monitor */}
      <div className="mt-2 border-t border-white/8 pt-8">
        <AIQualityMonitor mode={mode} />
      </div>
    </SectionWrapper>
  );
}
