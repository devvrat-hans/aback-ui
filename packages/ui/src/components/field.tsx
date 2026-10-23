import * as React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export interface FieldProps extends React.ComponentProps<"div"> {
  /** The control id this field labels. */
  htmlFor: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
}

/**
 * Layout and labeling for a single form control. It does not inject props into
 * the control; pass `id`, `aria-describedby`, and `aria-invalid` explicitly so
 * the relationship stays visible in the consuming code.
 */
function Field({
  htmlFor,
  label,
  description,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-sm font-medium leading-none text-foreground"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        ) : null}
      </label>
      {children}
      {description ? (
        <p id={`${htmlFor}-description`} className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium leading-relaxed text-danger"
        >
          <IconAlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field };
