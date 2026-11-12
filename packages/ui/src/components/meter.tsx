import * as React from "react";

import { cn } from "../lib/utils";

export type MeterTone = "brand" | "neutral" | "success" | "warning" | "danger";

const toneFill: Record<MeterTone, string> = {
  brand: "bg-primary-500",
  neutral: "bg-foreground",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const trackSize = {
  sm: "h-1",
  default: "h-2",
  lg: "h-3",
} as const;

export interface MeterProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The measurement. Values outside `min` and `max` are clamped. */
  value: number;
  min?: number;
  max?: number;
  /** Visible caption and the meter's accessible name. Use `aria-label` when there is no room for one. */
  label?: React.ReactNode;
  /**
   * The visible value beside the label, such as "82 / 100" or "7.2 of 10 GB".
   * Defaults to the rounded percentage when `showValue` is set.
   */
  valueLabel?: React.ReactNode;
  /** Shows the value beside the label. Implied when `valueLabel` is given. */
  showValue?: boolean;
  /**
   * What assistive technology reads for the value. Defaults to `valueLabel`
   * when that is a string, so "7.2 of 10 GB" is not read as "72 percent".
   */
  valueText?: string;
  /** Colours the fill. Say what the colour means in the label or the value. */
  tone?: MeterTone;
  size?: keyof typeof trackSize;
  indicatorClassName?: string;
}

/**
 * A measurement inside a known range: a score, a quota, a password strength,
 * disk usage. Use Progress for a task that is running toward completion; a
 * meter is a reading, and it can go down as well as up.
 */
function Meter({
  value,
  min = 0,
  max = 100,
  label,
  valueLabel,
  showValue = false,
  valueText,
  tone = "brand",
  size = "default",
  indicatorClassName,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: MeterProps) {
  const labelId = React.useId();
  const span = max - min;
  const bounded = Number.isFinite(value) ? Math.min(Math.max(value, min), max) : min;
  const percent = span > 0 ? ((bounded - min) / span) * 100 : 0;
  const valueVisible = showValue || valueLabel !== undefined;
  const visibleValue = valueLabel ?? `${Math.round(percent)}%`;

  return (
    <div
      data-slot="meter"
      data-tone={tone}
      className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
      {...props}
    >
      {label || valueVisible ? (
        <div className="flex items-baseline justify-between gap-3">
          {label ? (
            <span id={labelId} className="min-w-0 text-sm font-medium text-foreground">
              {label}
            </span>
          ) : (
            <span />
          )}
          {valueVisible ? (
            <span
              data-slot="meter-value"
              className="shrink-0 text-xs tabular-nums text-muted-foreground"
            >
              {visibleValue}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        data-slot="meter-track"
        role="meter"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={bounded}
        aria-valuetext={valueText ?? (typeof valueLabel === "string" ? valueLabel : undefined)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (label && !ariaLabel ? labelId : undefined)}
        className={cn("w-full overflow-hidden bg-muted", trackSize[size])}
      >
        <div
          data-slot="meter-indicator"
          className={cn(
            "h-full transition-[width] duration-300 motion-reduce:transition-none",
            toneFill[tone],
            indicatorClassName,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export { Meter };
