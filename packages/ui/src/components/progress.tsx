"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  /** Accessible name. A progress bar without a name is not usable. */
  label?: string;
  /** Optional visible value, for example `64%`. Enable when the number matters. */
  showValue?: boolean;
  indicatorClassName?: string;
}

function Progress({
  className,
  value,
  max = 100,
  label,
  showValue = false,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const bounded = value === null || value === undefined ? null : Math.min(Math.max(value, 0), max);
  const percent = bounded === null ? 0 : max > 0 ? (bounded / max) * 100 : 0;

  return (
    <div data-slot="progress" className="flex w-full flex-col gap-1.5">
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-3">
          {label ? <span className="text-sm font-medium text-foreground">{label}</span> : <span />}
          {showValue ? (
            <span className="text-xs tabular-nums text-muted-foreground">
              {bounded === null ? "Working" : `${Math.round(percent)}%`}
            </span>
          ) : null}
        </div>
      ) : null}
      <ProgressPrimitive.Root
        data-slot="progress-root"
        {...props}
        value={bounded}
        max={max}
        aria-label={label ?? props["aria-label"]}
        className={cn("relative h-1.5 w-full overflow-hidden bg-muted", className)}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full w-full flex-1 bg-primary-500 transition-transform duration-300 motion-reduce:transition-none",
            bounded === null ? "animate-pulse" : "",
            indicatorClassName,
          )}
          style={{ transform: `translateX(-${100 - percent}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}

export { Progress };
