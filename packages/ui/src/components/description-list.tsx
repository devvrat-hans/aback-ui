import * as React from "react";

import { cn } from "../lib/utils";

type DetailsTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneText: Record<DetailsTone, string> = {
  neutral: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export interface DescriptionListProps extends React.ComponentProps<"dl"> {
  /** Draws the outer border. Turn it off when the list sits inside a card. */
  bordered?: boolean;
}

/**
 * Key and value rows: file metadata, a price breakdown, request headers, or
 * account details. A real `<dl>`, so each term labels its value for assistive
 * technology. Rows wrap on narrow screens instead of truncating the value.
 */
function DescriptionList({ bordered = true, className, ...props }: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      className={cn("divide-y divide-border text-sm", bordered && "border border-border", className)}
      {...props}
    />
  );
}

export interface DescriptionListItemProps extends React.ComponentProps<"div"> {
  /** A bold row with a heavier rule, for a total. */
  emphasis?: boolean;
}

function DescriptionListItem({ emphasis = false, className, ...props }: DescriptionListItemProps) {
  return (
    <div
      data-slot="description-list-item"
      data-emphasis={emphasis ? "" : undefined}
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-2.5",
        emphasis && "border-t-2 border-t-border font-semibold [&>dt]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface DescriptionListTermProps extends React.ComponentProps<"dt"> {
  /** Monospace keys for technical fields such as header names. */
  mono?: boolean;
}

function DescriptionListTerm({ mono = false, className, ...props }: DescriptionListTermProps) {
  return (
    <dt
      data-slot="description-list-term"
      className={cn(
        "min-w-[4.5rem] text-muted-foreground",
        mono && "font-mono text-xs",
        className,
      )}
      {...props}
    />
  );
}

export interface DescriptionListDetailsProps extends React.ComponentProps<"dd"> {
  /** Colours the value. Keep a sign or a word with it, such as "-$12" or "saved". */
  tone?: DetailsTone;
}

function DescriptionListDetails({ tone = "neutral", className, ...props }: DescriptionListDetailsProps) {
  return (
    <dd
      data-slot="description-list-details"
      className={cn("text-right tabular-nums break-words", toneText[tone], className)}
      {...props}
    />
  );
}

export { DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm };
