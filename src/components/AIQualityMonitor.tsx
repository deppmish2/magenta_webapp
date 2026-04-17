import { motion } from "framer-motion";
import { Activity, CheckCircle2, RefreshCw, ShieldCheck, TrendingDown, Zap } from "lucide-react";
import type { DemoMode } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface Metric {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  good: boolean;
}

const METRICS_BY_MODE: Record<DemoMode, Metric[]> = {
  consumer: [
    { label: "Groundedness score", value: "96.2%", subtext: "Answers traceable to cited sources", good: true },
    { label: "Hallucination rate", value: "0.8%", subtext: "Flagged by eval loop · last 1 000 queries", trend: "↓ from 2.1%", good: true },
    { label: "Citation coverage", value: "100%", subtext: "Every answer carries at least one source", good: true },
    { label: "Avg confidence", value: "94.1%", subtext: "Model self-assessed, calibrated weekly", good: true },
  ],
  enterprise: [
    { label: "Groundedness score", value: "94.6%", subtext: "RAG retrieval grounding verified", good: true },
    { label: "Hallucination rate", value: "1.2%", subtext: "Auto-flagged before delivery", trend: "↓ from 3.4%", good: true },
    { label: "Policy violations", value: "0", subtext: "Governance checks · last 24 hours", good: true },
    { label: "Escalation rate", value: "2.3%", subtext: "Low-confidence answers routed to human", good: true },
  ],
  architect: [
    { label: "Groundedness score", value: "97.1%", subtext: "Retrieval pipeline + freshness gate", good: true },
    { label: "Hallucination rate", value: "0.4%", subtext: "Inline eval + cross-check layer", trend: "↓ from 1.9%", good: true },
    { label: "Fallback rate", value: "0.8%", subtext: "Model gateway fallover events", good: true },
    { label: "Eval loop cadence", value: "Hourly", subtext: "Continuous quality regression cycle", good: true },
  ],
};

const REDUCTION_TECHNIQUES = [
  {
    icon: ShieldCheck,
    title: "Retrieval-augmented grounding",
    detail: "Every answer is anchored to retrieved, approved sources — the model cannot freely generate facts outside the evidence pack.",
  },
  {
    icon: Activity,
    title: "Inline confidence gating",
    detail: "Low-confidence completions are intercepted before delivery and either escalated or returned with explicit uncertainty signals.",
  },
  {
    icon: RefreshCw,
    title: "Continuous evaluation loop",
    detail: "An automated eval pipeline runs groundedness, safety, and citation quality checks hourly against a curated test set.",
  },
  {
    icon: TrendingDown,
    title: "Drift detection",
    detail: "Statistical monitoring flags when answer quality or hallucination rates deviate from the baseline — triggering model review.",
  },
  {
    icon: CheckCircle2,
    title: "Human-in-the-loop escalation",
    detail: "Edge cases and low-confidence outputs are routed to reviewers, whose corrections feed back into the evaluation baseline.",
  },
  {
    icon: Zap,
    title: "Prompt hardening",
    detail: "System prompts enforce structured output formats and citation requirements — making it structurally harder for the model to hallucinate.",
  },
];

interface AIQualityMonitorProps {
  mode: DemoMode;
}

export function AIQualityMonitor({ mode }: AIQualityMonitorProps) {
  const metrics = METRICS_BY_MODE[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-magenta-200/70">
            AI Quality & Observability
          </p>
          <h3 className="font-display text-2xl text-white">
            How we measure and reduce hallucinations
          </h3>
        </div>
        <Badge>Live eval active</Badge>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Card className="border-white/10 bg-black/30">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  {m.label}
                </p>
                <p className="mt-2 font-display text-3xl text-white">{m.value}</p>
                {m.trend ? (
                  <p className="mt-1 text-xs font-medium text-emerald-400">{m.trend}</p>
                ) : null}
                <p className="mt-1.5 text-xs leading-5 text-white/50">{m.subtext}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reduction techniques */}
      <Card className="border-white/10 bg-black/30">
        <CardContent className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            Hallucination reduction techniques
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {REDUCTION_TECHNIQUES.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="mt-0.5 shrink-0 rounded-xl border border-magenta-400/20 bg-magenta-500/10 p-2">
                    <Icon className="h-3.5 w-3.5 text-magenta-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/52">{t.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
