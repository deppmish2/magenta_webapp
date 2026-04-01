import {
  modeThemes,
  opsMetrics,
  priorityMetricIdsByMode,
  regionalStatus,
  rolloutPlays,
} from "../data/demoContent";
import type { DemoMode } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const operatingNotes: Record<DemoMode, string[]> = {
  consumer: [
    "Keep latency low enough that the answer feels immediate.",
    "Preserve citation quality while the experience stays clean and minimal.",
    "Make voice and text share one polished surface during the demo.",
  ],
  enterprise: [
    "Show that rollout controls exist before usage scales materially.",
    "Tie trust posture to groundedness, escalation, and cost together.",
    "Make residency and audit evidence feel boardroom-ready.",
  ],
  architect: [
    "Expose failover and canary logic without turning the page into a raw dashboard.",
    "Demonstrate that the gateway, retrieval, and observability loops are joined up.",
    "Keep the cockpit premium enough to present, detailed enough to believe.",
  ],
};

export function OperationsCockpit({ mode }: { mode: DemoMode }) {
  const selectedMetrics = priorityMetricIdsByMode[mode]
    .map((metricId) => opsMetrics.find((metric) => metric.id === metricId))
    .filter((metric): metric is NonNullable<typeof metric> => Boolean(metric));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {selectedMetrics.map((metric) => (
          <Card key={metric.id} className="border-white/10 bg-black/30">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                {metric.label}
              </p>
              <p className="font-display text-3xl text-white">{metric.value}</p>
              <p className="text-sm text-magenta-100/80">{metric.delta}</p>
              <p className="text-sm leading-6 text-white/55">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden border-white/10 bg-black/30">
          <CardContent className="space-y-6 p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge>Rollout control plane</Badge>
                <h3 className="font-display text-3xl text-white">
                  Premium operations, not admin sprawl
                </h3>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Current emphasis
                </p>
                <p className="mt-2 text-sm text-white/72">
                  {modeThemes[mode].operationsHeadline}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {rolloutPlays.map((play) => (
                <div
                  key={play.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-xl text-white">{play.title}</p>
                    <Badge variant="muted">{play.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/64">
                    {play.note}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-white/10 bg-black/30">
          <CardContent className="space-y-6 p-6 sm:p-7">
            <div className="space-y-2">
              <Badge>Regional posture</Badge>
              <h3 className="font-display text-3xl text-white">
                Scale and sovereignty snapshot
              </h3>
            </div>

            <div className="space-y-3">
              {regionalStatus.map((region) => (
                <div
                  key={region.region}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{region.region}</p>
                    <Badge variant="muted">{region.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {region.posture}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                Operating notes
              </p>
              <div className="mt-4 space-y-3">
                {operatingNotes[mode].map((note) => (
                  <p key={note} className="text-sm leading-7 text-white/64">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
