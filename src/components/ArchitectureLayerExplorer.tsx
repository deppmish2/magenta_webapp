import { useEffect, useState } from "react";
import {
  Activity,
  AppWindow,
  Database,
  Route,
  Search,
  ServerCog,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import {
  architectureLayers,
  modeThemes,
  promptById,
} from "../data/demoContent";
import { cn } from "../lib/utils";
import type { DemoMode } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const layerIcons = {
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

const defaultLayerByMode: Record<DemoMode, string> = {
  consumer: "experience",
  enterprise: "governance",
  architect: "orchestration",
};

const modeLens: Record<DemoMode, string> = {
  consumer:
    "Keep the platform mostly invisible and let the answer experience feel effortless.",
  enterprise:
    "Make control points and evidence easy for decision makers to understand during the demo.",
  architect:
    "Surface the interfaces, policies, and scale decisions that sit behind the polished UI.",
};

interface ArchitectureLayerExplorerProps {
  mode: DemoMode;
  promptId: string;
}

export function ArchitectureLayerExplorer({
  mode,
  promptId,
}: ArchitectureLayerExplorerProps) {
  const [activeLayerId, setActiveLayerId] = useState(defaultLayerByMode[mode]);

  useEffect(() => {
    setActiveLayerId(defaultLayerByMode[mode]);
  }, [mode]);

  const activeLayer =
    architectureLayers.find((layer) => layer.id === activeLayerId) ??
    architectureLayers[0];
  const currentPrompt = promptById[promptId];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="space-y-3">
        {architectureLayers.map((layer, index) => {
          const Icon = layerIcons[layer.id as keyof typeof layerIcons] ?? Workflow;
          const active = layer.id === activeLayer.id;
          const recommended = layer.id === defaultLayerByMode[mode];

          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayerId(layer.id)}
              className={cn(
                "w-full rounded-[26px] border p-4 text-left transition-all duration-300",
                active
                  ? "border-white/25 bg-white/[0.1] shadow-glow"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]",
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "rounded-2xl border p-3",
                    active
                      ? "border-magenta-300/30 bg-magenta-500/14 text-magenta-50"
                      : "border-white/10 bg-white/5 text-white/60",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-lg text-white">{layer.title}</p>
                    {recommended ? (
                      <Badge variant={active ? "default" : "muted"}>
                        Mode default
                      </Badge>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.24em] text-white/35">
                        Layer {index + 1}
                      </span>
                    )}
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

      <Card className="overflow-hidden border-white/10 bg-black/30">
        <CardContent className="space-y-7 p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge>Clickable architecture</Badge>
              <div className="space-y-2">
                <h3 className="font-display text-3xl text-white">
                  {activeLayer.title}
                </h3>
                <p className="max-w-xl text-base leading-7 text-white/68">
                  {activeLayer.subtitle}
                </p>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                Active scenario
              </p>
              <p className="mt-2 text-sm text-white/72">
                {currentPrompt?.category ?? "Answer engine"}
              </p>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-magenta-200/75">
              {modeThemes[mode].label} lens
            </p>
            <p className="mt-3 text-sm leading-7 text-white/66">{modeLens[mode]}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LayerDetail label="What it does" value={activeLayer.whatItDoes} />
            <LayerDetail label="Why it matters" value={activeLayer.whyItMatters} />
            <LayerDetail label="How it scales" value={activeLayer.howItScales} />
            <LayerDetail
              label="Architect focus"
              value={activeLayer.architectFocus}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-display text-xl text-white">Critical controls</h4>
              <p className="text-sm text-white/45">
                Clean enough for a live walkthrough
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeLayer.controls.map((control) => (
                <div
                  key={control.label}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/72"
                  title={control.hint}
                >
                  {control.label}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LayerDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/66">{value}</p>
    </div>
  );
}
