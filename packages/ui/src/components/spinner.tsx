import * as React from "react";
import { IconLoader2 } from "@tabler/icons-react";

import { cn } from "../lib/utils";

const spinnerSizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export interface SpinnerProps extends React.ComponentProps<"span"> {
  /** Announced to assistive technology. */
  label?: string;
  size?: keyof typeof spinnerSizes;
}

function Spinner({
  label = "Loading",
  size = "md",
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role="status"
      className={cn("inline-flex items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <IconLoader2 aria-hidden="true" className={cn("animate-spin", spinnerSizes[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner };
