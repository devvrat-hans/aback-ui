import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 border px-2.5 py-0.5 text-xs font-semibold leading-4 [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        brand:
          "border-primary-200 bg-brand-chip text-primary-700 dark:border-primary-800/40 dark:text-primary-300",
        success: "border-success/20 bg-success-soft text-success-strong",
        warning: "border-warning/20 bg-warning-soft text-warning-strong",
        danger: "border-danger/20 bg-danger-soft text-danger-strong",
        info: "border-info/20 bg-info-soft text-info",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        muted: "border-transparent bg-muted/60 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /**
   * Leads with a small square status dot in the badge's text colour. The dot
   * is decorative; the badge text still has to say what the status is.
   */
  dot?: boolean;
}

function Badge({ className, variant = "secondary", dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), dot && "gap-1.5", className)}
      {...props}
    >
      {dot ? (
        <span aria-hidden="true" data-slot="badge-dot" className="size-1.5 shrink-0 bg-current" />
      ) : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
