import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Layers, Lock, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { modePanelClasses } from "../data/demoContent";
import { cn } from "../lib/utils";

const SUPPORTING_POINTS = [
  {
    icon: Zap,
    label: "Rapid Value Discovery",
    description: "Use case identification and business case validation in weeks.",
  },
  {
    icon: Lock,
    label: "Secure Deployment",
    description: "Sovereign-ready infrastructure with EU data residency by design.",
  },
  {
    icon: Layers,
    label: "Governed Integration",
    description: "Enterprise data connected with audit trails and access controls.",
  },
  {
    icon: BarChart2,
    label: "Scalable Architecture",
    description: "Platform designed for multi-use-case rollout from day one.",
  },
];

interface FinalCTASectionProps {
  onStartTransformation: () => void;
}

export function FinalCTASection({ onStartTransformation }: FinalCTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[36px] border border-white/10 px-6 py-16 shadow-panel backdrop-blur-xl sm:px-8 sm:py-20 lg:px-12",
        "bg-white/[0.035]",
      )}
    >
      <div className="absolute inset-0 bg-hero-grid bg-[size:38px_38px] opacity-[0.05]" />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          modePanelClasses.enterprise,
        )}
      />
      {/* Extra glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(226,0,116,0.22),transparent_55%)]" />

      <div className="relative space-y-12">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-magenta-300/65">
            Next Step
          </p>
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            Turn AI ambition into trusted enterprise outcomes.
          </h2>
          <p className="text-lg leading-8 text-white/60">
            T-Systems brings the strategy, architecture, and delivery discipline to move from AI ambition
            to governed production deployment — at a pace that enterprises can sustain.
          </p>
        </motion.div>

        {/* Supporting points */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {SUPPORTING_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.label}
                className="rounded-[22px] border border-white/10 bg-black/25 px-5 py-4 space-y-3"
              >
                <div className="rounded-xl border border-magenta-400/20 bg-magenta-500/10 w-fit p-2">
                  <Icon className="h-4 w-4 text-magenta-300" />
                </div>
                <p className="font-display text-base text-white">{point.label}</p>
                <p className="text-sm leading-6 text-white/55">{point.description}</p>
              </div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <Button variant="accent" onClick={onStartTransformation}>
            Start the Transformation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-white/40">
            T-Systems &middot; AI &amp; Data Platform
          </p>
        </motion.div>
      </div>
    </section>
  );
}
