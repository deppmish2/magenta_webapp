import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface SectionWrapperProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
  tintClassName?: string;
}

export function SectionWrapper({
  id,
  eyebrow,
  title,
  description,
  children,
  aside,
  className,
  tintClassName,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("section-shell", className)}>
      <div className="section-grid" />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          tintClassName,
        )}
      />
      <div className="relative space-y-8 lg:space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-magenta-200/70">
              {eyebrow}
            </p>
            <div className="space-y-3">
              <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-[2.65rem]">
                {title}
              </h2>
              {description ? (
                <p className="max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {aside ? <div className="max-w-md">{aside}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
