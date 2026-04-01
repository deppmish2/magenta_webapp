import { ShieldCheck } from "lucide-react";
import {
  modeThemes,
  responseByPromptId,
  trustControls,
} from "../data/demoContent";
import type { DemoMode } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface TrustControlsPanelProps {
  mode: DemoMode;
  promptId: string;
}

export function TrustControlsPanel({
  mode,
  promptId,
}: TrustControlsPanelProps) {
  const activeResponse = responseByPromptId[promptId];
  const visibleControls = trustControls.filter((control) =>
    control.modes.includes(mode),
  );
  const theme = modeThemes[mode];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="overflow-hidden border-white/10 bg-black/30">
        <CardContent className="space-y-6 p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <Badge>Visible trust</Badge>
            <ShieldCheck className="h-5 w-5 text-magenta-100" />
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-3xl text-white">
              {theme.trustHeadline}
            </h3>
            <p className="text-base leading-7 text-white/68">
              {activeResponse?.trustReason}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TrustMetric
              label="Current confidence"
              value={activeResponse?.confidence ?? "93% grounded"}
            />
            <TrustMetric
              label="Evidence pack"
              value={`${activeResponse?.sources.length ?? 0} source cards`}
            />
            <TrustMetric
              label="Escalation posture"
              value={mode === "consumer" ? "Ready if needed" : "Policy-backed"}
            />
            <TrustMetric
              label="Auditability"
              value={mode === "architect" ? "Trace attached" : "Available on demand"}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {activeResponse?.trustBadges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleControls.map((control) => (
          <Card key={control.id} className="border-white/10 bg-black/30">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{control.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">
                    {control.status}
                  </p>
                </div>
                <Badge variant="muted">{theme.label}</Badge>
              </div>
              <p className="text-sm leading-7 text-white/66">
                {control.description}
              </p>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45">
                  Evidence
                </p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {control.evidence}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrustMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
        {label}
      </p>
      <p className="mt-3 font-display text-xl text-white">{value}</p>
    </div>
  );
}
