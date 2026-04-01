import { journeyFocusByMode, transformationJourney } from "../data/demoContent";
import type { DemoMode } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export function TransformationJourneyTimeline({
  mode,
}: {
  mode: DemoMode;
}) {
  const focusStage = journeyFocusByMode[mode];

  return (
    <Card className="overflow-hidden border-white/10 bg-black/30">
      <CardContent className="space-y-5 p-6 sm:p-7">
        <div className="space-y-2">
          <Badge>Transformation journey</Badge>
          <h3 className="font-display text-3xl text-white">
            Consulting story from pilot to scale
          </h3>
          <p className="text-base leading-7 text-white/66">
            The timeline is tuned for an interview walkthrough: quick to scan, easy to narrate, and aligned to the page sections.
          </p>
        </div>

        <div className="space-y-4">
          {transformationJourney.map((stage, index) => {
            const active = stage.stage === focusStage;

            return (
              <div key={stage.stage} className="relative pl-8">
                {index < transformationJourney.length - 1 ? (
                  <span className="absolute left-[11px] top-10 h-[calc(100%+1rem)] w-px bg-white/10" />
                ) : null}
                <span
                  className={
                    active
                      ? "absolute left-0 top-1 h-[22px] w-[22px] rounded-full border border-magenta-300/40 bg-magenta-500/20 shadow-glow"
                      : "absolute left-[2px] top-[3px] h-[18px] w-[18px] rounded-full border border-white/20 bg-white/10"
                  }
                />
                <div
                  className={
                    active
                      ? "rounded-[24px] border border-white/20 bg-white/[0.08] p-5"
                      : "rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-display text-xl text-white">{stage.stage}</h4>
                    {active ? <Badge>Focus in {mode}</Badge> : <Badge variant="muted">Stage</Badge>}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/66">
                    {stage.clientConcern}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    {stage.architecturalFocus}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/40">
                        Deliverable
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/64">
                        {stage.deliverable}
                      </p>
                    </div>
                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/40">
                        Success metric
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/64">
                        {stage.successMetric}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
