import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em]",
  {
    variants: {
      variant: {
        default: "border-magenta-400/40 bg-magenta-500/15 text-magenta-100",
        muted: "border-white/10 bg-white/5 text-white/60",
        success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
