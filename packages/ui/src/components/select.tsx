import * as React from "react";
import { IconChevronDown } from "@tabler/icons-react";

import { cn } from "../lib/utils";

const selectClassName = [
  "h-9 w-full appearance-none border border-input bg-background px-3 pr-9 text-sm text-foreground shadow-xs",
  "outline-none transition-[color,background-color,border-color,box-shadow] duration-200",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
].join(" ");

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  function Select({ className, children, ...props }, ref) {
    return (
      <div data-slot="select" className="relative w-full">
        <select
          ref={ref}
          data-slot="select-control"
          className={cn(selectClassName, className)}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select, selectClassName };
