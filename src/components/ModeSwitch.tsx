import type { DemoMode } from "../types";
import { modeThemes } from "../data/demoContent";
import { cn } from "../lib/utils";

const orderedModes: DemoMode[] = ["consumer", "enterprise", "architect"];

interface ModeSwitchProps {
  mode: DemoMode;
  onChange: (mode: DemoMode) => void;
  compact?: boolean;
}

export function ModeSwitch({
  mode,
  onChange,
  compact = false,
}: ModeSwitchProps) {
  if (compact) {
    return (
      <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1.5 shadow-panel backdrop-blur-xl">
        {orderedModes.map((item) => {
          const active = item === mode;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition-all duration-300",
                active
                  ? "bg-white text-canvas shadow-lg"
                  : "text-white/55 hover:text-white",
              )}
            >
              {modeThemes[item].label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {orderedModes.map((item) => {
        const active = item === mode;
        const theme = modeThemes[item];

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "rounded-[24px] border p-4 text-left transition-all duration-300",
              active
                ? "border-white/25 bg-white/12 shadow-glow"
                : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-magenta-200/80">
              {theme.label}
            </p>
            <h3 className="mt-3 font-display text-xl text-white">
              {theme.audience}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {theme.demoCallout}
            </p>
          </button>
        );
      })}
    </div>
  );
}
