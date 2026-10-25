import * as React from "react";
import { IconCheck } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export type StepStatus = "complete" | "current" | "upcoming";

const statusText: Record<StepStatus, string> = {
  complete: "Completed",
  current: "Current step",
  upcoming: "Not started",
};

export interface StepsProps extends React.ComponentProps<"ol"> {
  orientation?: "vertical" | "horizontal";
}

/**
 * An ordered sequence: onboarding, a checkout, a "how it works" section, or a
 * setup guide. It is an `<ol>`, so the count and position are announced, and
 * numbers come from a CSS counter rather than props.
 */
function Steps({ orientation = "vertical", className, ...props }: StepsProps) {
  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      className={cn(
        "group/steps [counter-reset:step]",
        orientation === "vertical"
          ? "flex flex-col"
          : "grid grid-cols-1 gap-6 sm:auto-cols-fr sm:grid-flow-col sm:gap-4",
        className,
      )}
      {...props}
    />
  );
}

export interface StepProps extends Omit<React.ComponentProps<"li">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: StepStatus;
  /** Replaces the sr-only status prefix, for localization. */
  statusLabel?: string;
}

function Step({
  title,
  description,
  status = "upcoming",
  statusLabel,
  className,
  children,
  ...props
}: StepProps) {
  return (
    <li
      data-slot="step"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "relative flex gap-4 [counter-increment:step] last:[&>[data-slot=step-connector]]:hidden",
        "group-data-[orientation=vertical]/steps:pb-8 group-data-[orientation=vertical]/steps:last:pb-0",
        "sm:group-data-[orientation=horizontal]/steps:flex-col sm:group-data-[orientation=horizontal]/steps:gap-3",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="step-connector"
        className={cn(
          "absolute bg-border",
          "group-data-[orientation=vertical]/steps:left-4 group-data-[orientation=vertical]/steps:top-9 group-data-[orientation=vertical]/steps:bottom-1 group-data-[orientation=vertical]/steps:w-px",
          "group-data-[orientation=horizontal]/steps:hidden sm:group-data-[orientation=horizontal]/steps:block",
          "sm:group-data-[orientation=horizontal]/steps:left-11 sm:group-data-[orientation=horizontal]/steps:right-1 sm:group-data-[orientation=horizontal]/steps:top-4 sm:group-data-[orientation=horizontal]/steps:h-px",
          status === "complete" && "bg-primary-200 dark:bg-primary-800",
        )}
      />
      <span
        aria-hidden="true"
        data-slot="step-marker"
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center text-xs font-bold tabular-nums",
          status === "upcoming"
            ? "border border-border bg-background text-muted-foreground"
            : "bg-brand-fill text-on-brand-fill",
          status === "current" &&
            "ring-2 ring-primary-200 ring-offset-2 ring-offset-background dark:ring-primary-800",
        )}
      >
        {status === "complete" ? (
          <IconCheck className="size-4" />
        ) : (
          <span className="before:content-[counter(step)]" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
        <p
          className={cn(
            "text-sm font-semibold",
            status === "upcoming" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          <span className="sr-only">{statusLabel ?? statusText[status]}: </span>
          {title}
        </p>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </div>
    </li>
  );
}

export { Step, Steps };
