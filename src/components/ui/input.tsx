import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none transition-all placeholder:text-white/35 focus:border-magenta-400/40 focus:ring-2 focus:ring-magenta-400/20",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input };
