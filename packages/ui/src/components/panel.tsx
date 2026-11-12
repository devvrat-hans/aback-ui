import * as React from "react";

import { cn } from "../lib/utils";

const panelVariants = {
  muted: "bg-muted/20",
  card: "bg-card",
} as const;

const panelSizes = {
  sm: "gap-3 p-3",
  default: "gap-4 p-4",
} as const;

export interface PanelProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** The heading of the zone. It also names the group for assistive technology. */
  title?: React.ReactNode;
  /** A 16px icon before the title. Decorative. */
  icon?: React.ReactNode;
  /** Sits at the end of the heading row: a copy button, a badge, a reset link. */
  actions?: React.ReactNode;
  /** One line under the heading. */
  description?: React.ReactNode;
  /** Heading level. A panel sits inside a card whose title is one level up. */
  as?: "h2" | "h3" | "h4" | "h5";
  /** `muted` for options and results. `card` for a sub-panel nested inside a muted one. */
  variant?: keyof typeof panelVariants;
  size?: keyof typeof panelSizes;
}

/**
 * A bordered zone inside a card: the options of a tool, a result group, a
 * settings cluster. Use it instead of nesting one Card in another; a panel has
 * no shadow and a quieter heading, so the card stays the surface.
 */
function Panel({
  title,
  icon,
  actions,
  description,
  as: Heading = "h3",
  variant = "muted",
  size = "default",
  className,
  children,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: PanelProps) {
  const titleId = React.useId();
  const named = Boolean(title) || Boolean(ariaLabelledBy) || Boolean(props["aria-label"]);

  return (
    <div
      data-slot="panel"
      data-variant={variant}
      role={named ? "group" : undefined}
      aria-labelledby={ariaLabelledBy ?? (title && !props["aria-label"] ? titleId : undefined)}
      className={cn(
        "flex min-w-0 flex-col border border-border",
        panelVariants[variant],
        panelSizes[size],
        className,
      )}
      {...props}
    >
      {title || actions || description ? (
        <div data-slot="panel-header" className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {title ? (
              <Heading
                id={titleId}
                data-slot="panel-title"
                className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
              >
                {icon ? (
                  <span aria-hidden="true" className="inline-flex">
                    {icon}
                  </span>
                ) : null}
                {title}
              </Heading>
            ) : (
              <span />
            )}
            {actions ? (
              <div data-slot="panel-actions" className="flex flex-wrap items-center gap-2">
                {actions}
              </div>
            ) : null}
          </div>
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export { Panel };
