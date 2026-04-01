import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AppWindow,
  Bot,
  Database,
  Route,
  Search,
  ServerCog,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import architectureLayersData from "../data/architectureLayers.json";
import type { ArchitectureLayer } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

const architectureLayers = architectureLayersData as ArchitectureLayer[];

const iconMap = {
  channels: Smartphone,
  experience: AppWindow,
  orchestration: Workflow,
  retrieval: Search,
  source: Database,
  "model-gateway": Route,
  governance: ShieldCheck,
  operations: Activity,
  infrastructure: ServerCog,
} satisfies Record<string, typeof Smartphone>;

export function ArchitectureExplorer() {
  const [activeLayerId, setActiveLayerId] = useState<string>("orchestration");

  const activeLayer =
    architectureLayers.find((layer) => layer.id === activeLayerId) ??
    architectureLayers[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4">
        {architectureLayers.map((layer, index) => {
          const Icon =
            iconMap[layer.id as keyof typeof iconMap] ?? Workflow;
          const active = layer.id === activeLayer.id;

          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayerId(layer.id)}
              className={`group relative w-full rounded-[28px] border p-4 text-left transition-all duration-300 ${
                active
                  ? "border-magenta-400/40 bg-magenta-500/10 shadow-glow"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="absolute left-7 top-16 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-magenta-400/40 to-transparent md:block" />
              <div className="relative flex items-start gap-4">
                <div
                  className={`mt-1 rounded-2xl border p-3 ${
                    active
                      ? "border-magenta-400/50 bg-magenta-500/15 text-magenta-100"
                      : "border-white/10 bg-white/5 text-white/65"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-lg text-white">{layer.title}</p>
                    <Badge variant={active ? "default" : "muted"}>
                      Layer {index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-white/60">
                    {layer.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeLayer.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Card className="h-full overflow-hidden bg-gradient-to-br from-magenta-500/10 via-black/20 to-white/[0.03]">
          <CardContent className="space-y-8 p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge>Clickable architecture</Badge>
                <div className="space-y-2">
                  <h3 className="font-display text-3xl text-white">
                    {activeLayer.title}
                  </h3>
                  <p className="max-w-xl text-base leading-7 text-white/70">
                    {activeLayer.subtitle}
                  </p>
                </div>
              </div>
              <div className="rounded-[24px] border border-magenta-400/20 bg-black/30 px-4 py-3 text-sm text-white/70">
                Architect focus:{" "}
                <span className="text-white">{activeLayer.architectFocus}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                label="What It Does"
                value={activeLayer.whatItDoes}
              />
              <DetailCard
                label="Why It Matters"
                value={activeLayer.whyItMatters}
              />
              <DetailCard
                label="How It Scales"
                value={activeLayer.howItScales}
              />
              <DetailCard
                label="Architect Must Design For"
                value={activeLayer.architectFocus}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-xl text-white">
                  Architectural controls
                </h4>
                <p className="text-sm text-white/50">
                  Hover for why each control matters
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {activeLayer.controls.map((control) => (
                  <Tooltip key={control.label}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition-colors hover:border-magenta-400/40 hover:text-white"
                      >
                        {control.label}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{control.hint}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-magenta-200/75">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/70">{value}</p>
    </div>
  );
}
