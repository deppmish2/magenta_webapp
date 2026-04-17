import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Cpu, Shield } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onLaunchDemo: () => void;
  onExploreUseCases: () => void;
  onViewArchitecture: () => void;
}

export function HeroSection({
  onLaunchDemo,
  onExploreUseCases,
  onViewArchitecture,
}: HeroSectionProps) {
  return (
    <section
      id="overview"
      className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.035] px-6 py-16 shadow-panel backdrop-blur-xl sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-hero-grid bg-[size:38px_38px] opacity-[0.05]" />

      {/* Animated gradient tint */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(226,0,116,0.28),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_55%_80%,rgba(99,102,241,0.10),transparent_28%)]" />

      <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
        {/* Left: text content */}
        <div className="max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-2"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-magenta-300/70">
              T-Systems &middot; Enterprise AI Platform
            </p>
            <h1 className="font-display text-5xl leading-[1.1] text-white sm:text-6xl lg:text-[4.2rem]">
              MagentAI
              <br />
              <span className="bg-gradient-to-r from-magenta-300 via-magenta-400 to-fuchsia-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="space-y-4"
          >
            <p className="font-display text-2xl font-medium text-white/85 sm:text-3xl">
              AI at Scale. Human at Heart.
            </p>
            <p className="max-w-xl text-lg leading-8 text-white/60">
              T-Systems turns enterprise knowledge, workflows, and systems into trusted AI capabilities —
              from use case discovery to governed production deployment at scale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Button variant="accent" onClick={onLaunchDemo}>
              Launch AI Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={onExploreUseCases}>
              Explore Use Cases
            </Button>
            <Button variant="secondary" onClick={onViewArchitecture}>
              View Architecture
            </Button>
          </motion.div>
        </div>

        {/* Right: floating stat cards */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
          className="hidden lg:flex lg:flex-col lg:gap-4 lg:min-w-[260px]"
        >
          <FloatCard
            icon={<Cpu className="h-5 w-5 text-magenta-300" />}
            label="AI Orchestration"
            value="Production-grade"
            note="Multi-layer enterprise stack"
          />
          <FloatCard
            icon={<Shield className="h-5 w-5 text-emerald-300" />}
            label="Governance posture"
            value="EU Sovereign"
            note="Data residency by design"
          />
          <FloatCard
            icon={<BarChart3 className="h-5 w-5 text-sky-300" />}
            label="Time to value"
            value="8–12 weeks"
            note="Strategy to working prototype"
          />
        </motion.div>
      </div>
    </section>
  );
}

function FloatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/12 bg-black/35 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">{icon}</div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/40">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl text-white">{value}</p>
      <p className="mt-1 text-xs text-white/45">{note}</p>
    </div>
  );
}
