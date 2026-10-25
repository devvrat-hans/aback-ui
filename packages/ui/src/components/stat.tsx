import * as React from "react";
import { IconArrowDownRight, IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export type StatTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneText: Record<StatTone, string> = {
  neutral: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

const toneBorder: Record<StatTone, string> = {
  neutral: "border-border",
  success: "border-success/30",
  warning: "border-warning/30",
  danger: "border-danger/30",
  info: "border-info/30",
};

const toneSurface: Record<StatTone, string> = {
  neutral: "border-border bg-muted/40",
  success: "border-success/30 bg-success-soft",
  warning: "border-warning/30 bg-warning-soft",
  danger: "border-danger/30 bg-danger-soft",
  info: "border-info/30 bg-info-soft",
};

const valueSize = {
  sm: "text-sm",
  default: "text-xl leading-tight",
  lg: "text-3xl leading-none tracking-tight",
} as const;

export interface StatTrend {
  direction: "up" | "down" | "flat";
  /** Words that carry the change on their own, such as "+12% vs last week". */
  label: string;
  /** Defaults to success for up, danger for down, neutral for flat. */
  tone?: StatTone;
}

const defaultTrendTone: Record<StatTrend["direction"], StatTone> = {
  up: "success",
  down: "danger",
  flat: "neutral",
};

const trendIcon = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  flat: IconArrowRight,
} as const;

export interface StatProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: React.ReactNode;
  /** The formatted value: "$1,234", "42%", "3 h 20 min". */
  value: React.ReactNode;
  /** A unit after the value, in muted text. */
  unit?: React.ReactNode;
  /** A sub-line under the value. */
  hint?: React.ReactNode;
  /** A 16px icon, shown in a brand chip. Decorative. */
  icon?: React.ReactNode;
  /** Colours the value. Pair it with words in the label, hint, or a badge. */
  tone?: StatTone;
  /** Tints the whole tile with the tone, for a recommended or alert tile. */
  emphasis?: boolean;
  /** A badge after the label. */
  badge?: React.ReactNode;
  trend?: StatTrend;
  size?: keyof typeof valueSize;
}

/**
 * One labelled number. The label and value are a real description list, so
 * the label is announced with the value. Change the value freely; it is not a
 * live region, so a ticking number does not interrupt a screen reader.
 */
function Stat({
  label,
  value,
  unit,
  hint,
  icon,
  tone = "neutral",
  emphasis = false,
  badge,
  trend,
  size = "default",
  className,
  ...props
}: StatProps) {
  const TrendIcon = trend ? trendIcon[trend.direction] : null;
  const trendTone = trend ? (trend.tone ?? defaultTrendTone[trend.direction]) : "neutral";

  return (
    <div
      data-slot="stat"
      data-tone={tone}
      className={cn(
        "flex min-w-0 items-start gap-3 border p-4",
        emphasis ? toneSurface[tone] : cn("bg-card", toneBorder[tone]),
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center bg-brand-chip text-brand-icon [&_svg:not([class*='size-'])]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <dl className="flex min-w-0 flex-1 flex-col gap-1">
        <dt className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
          {label}
          {badge}
        </dt>
        <dd
          data-slot="stat-value"
          className={cn("font-semibold tabular-nums break-words", valueSize[size], toneText[tone])}
        >
          {value}
          {unit ? (
            <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </dd>
        {trend && TrendIcon ? (
          <dd
            data-slot="stat-trend"
            data-direction={trend.direction}
            className={cn("flex items-center gap-1 text-xs font-medium", toneText[trendTone])}
          >
            <TrendIcon aria-hidden="true" className="size-3.5 shrink-0" />
            {trend.label}
          </dd>
        ) : null}
        {hint ? <dd className="text-xs text-muted-foreground">{hint}</dd> : null}
      </dl>
    </div>
  );
}

const gridColumns = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
} as const;

export interface StatGridProps extends React.ComponentProps<"div"> {
  /** Columns at the widest breakpoint. Always one column on phones. */
  columns?: keyof typeof gridColumns;
  /** Draws the stats as one joined panel with hairline dividers. */
  joined?: boolean;
}

/** A responsive grid of Stat tiles. */
function StatGrid({ columns = 3, joined = false, className, ...props }: StatGridProps) {
  return (
    <div
      data-slot="stat-grid"
      className={cn(
        "grid",
        gridColumns[columns],
        joined
          ? "gap-px border border-border bg-border [&>[data-slot=stat]]:border-0"
          : "gap-3",
        className,
      )}
      {...props}
    />
  );
}

export { Stat, StatGrid };
