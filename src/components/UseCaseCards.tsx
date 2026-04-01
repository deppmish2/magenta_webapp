import { Building2 } from "lucide-react";
import { useCaseHighlights, useCases } from "../data/demoContent";
import type { DemoMode } from "../types";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export function UseCaseCards({ mode }: { mode: DemoMode }) {
  const highlighted = new Set(useCaseHighlights[mode]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {useCases.map((useCase) => {
        const active = highlighted.has(useCase.id);

        return (
          <Card
            key={useCase.id}
            className={
              active
                ? "border-white/20 bg-white/[0.08]"
                : "border-white/10 bg-black/30"
            }
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  {active ? <Badge>Highlighted in {mode}</Badge> : <Badge variant="muted">Use case</Badge>}
                  <h3 className="font-display text-2xl text-white">
                    {useCase.title}
                  </h3>
                </div>
                <Building2 className="h-5 w-5 text-magenta-100" />
              </div>
              <p className="text-sm leading-7 text-white/66">
                {useCase.businessProblem}
              </p>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                  Workflow
                </p>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  {useCase.workflow}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {useCase.scalingConsiderations.map((item) => (
                  <Badge key={item} variant="muted">
                    {item}
                  </Badge>
                ))}
              </div>
              <p className="text-sm leading-7 text-white/68">{useCase.outcome}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
