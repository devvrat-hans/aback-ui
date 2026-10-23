import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative flex w-full items-start gap-2.5 border p-3 text-sm [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        info:
          "border-primary-200 bg-brand-wash/60 text-foreground dark:border-primary-800/60",
        success: "border-success/25 bg-success-soft text-success-strong",
        warning: "border-warning/25 bg-warning-soft text-warning-strong",
        destructive: "border-danger/25 bg-danger-soft text-danger-strong",
        muted: "border-border bg-muted/40 text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant = "info", ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("font-medium leading-snug", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm leading-relaxed text-current", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
