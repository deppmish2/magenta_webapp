import { Sparkles } from "lucide-react";
import type { DemoMode } from "../types";
import type { ModeTheme } from "../types";
import { Button } from "./ui/button";
import { ModeSwitch } from "./ModeSwitch";

interface NavigationItem {
  id: string;
  label: string;
}

interface StickyNavProps {
  mode: DemoMode;
  theme: ModeTheme;
  items: NavigationItem[];
  onModeChange?: (mode: DemoMode) => void;
  onDemoClick: () => void;
  showModeSwitch?: boolean;
  subtitle?: string;
}

export function StickyNav({
  mode,
  theme,
  items,
  onModeChange,
  onDemoClick,
  showModeSwitch = true,
  subtitle,
}: StickyNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05030a]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#overview" className="flex items-center gap-3">
          <div className="rounded-2xl border border-magenta-400/40 bg-magenta-500/15 p-2.5">
            <Sparkles className="h-5 w-5 text-magenta-100" />
          </div>
          <div>
            <p className="font-display text-lg text-white">MagentaAI Experience</p>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              {subtitle ?? `${theme.label} mode active`}
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {showModeSwitch && onModeChange ? (
            <ModeSwitch mode={mode} onChange={onModeChange} compact />
          ) : null}
          <Button variant="secondary" size="sm" onClick={onDemoClick}>
            Open Demo
          </Button>
        </div>
      </div>
    </header>
  );
}
