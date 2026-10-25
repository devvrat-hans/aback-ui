"use client";

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import {
  Toaster as SonnerToaster,
  toast,
  type ToasterProps as SonnerToasterProps,
} from "sonner";

import { cn } from "../lib/utils";

/**
 * The toast surface.
 *
 * `Toaster` is the Aback presentation of sonner: the same toast API the rest of
 * the ecosystem uses, drawn with the design tokens instead of sonner's own
 * palette. Mount it once near the root of the app, then call `toast()` from
 * anywhere — including event handlers and non-React modules.
 *
 * The status colours are read from the token layer, so a toast, an `Alert`, and
 * a `Badge` in the same viewport are the same green or red. The normal toast is
 * a popover surface, not a signal. The shape is square, like every other Aback
 * surface.
 *
 * Toasts are supplementary: a message that must be seen belongs inline, next to
 * the thing it is about. Use a toast when the failure has no natural home on the
 * page (an optimistic background mutation) or to confirm an action whose result
 * is no longer visible.
 */
export interface ToasterProps
  extends Omit<SonnerToasterProps, "className" | "style" | "theme"> {
  /** Force a theme. Defaults to `system`; pass the app's resolved theme when it is class-based. */
  theme?: "light" | "dark" | "system";
  className?: string;
}

const iconProps = { size: 16, stroke: 2, "aria-hidden": true } as const;

const tokenVariables = {
  // Neutral toast: a popover surface, so it follows the theme.
  "--normal-bg": "var(--popover)",
  "--normal-bg-hover": "var(--muted)",
  "--normal-border": "var(--border)",
  "--normal-border-hover": "var(--separator)",
  "--normal-text": "var(--popover-foreground)",

  // Status toasts: the same soft/strong pairs the Alert uses.
  "--success-bg": "var(--success-soft)",
  "--success-border": "color-mix(in oklab, var(--success) 30%, transparent)",
  "--success-text": "var(--success-strong)",
  "--error-bg": "var(--danger-soft)",
  "--error-border": "color-mix(in oklab, var(--danger) 30%, transparent)",
  "--error-text": "var(--danger-strong)",
  "--warning-bg": "var(--warning-soft)",
  "--warning-border": "color-mix(in oklab, var(--warning) 30%, transparent)",
  "--warning-text": "var(--warning-strong)",
  "--info-bg": "var(--info-soft)",
  "--info-border": "color-mix(in oklab, var(--info) 30%, transparent)",
  "--info-text": "var(--info)",

  // Square everywhere, like the rest of the system.
  "--border-radius": "0px",
  "--width": "22.5rem",
} as React.CSSProperties;

function Toaster({
  theme = "system",
  position = "top-right",
  closeButton = true,
  richColors = true,
  className,
  toastOptions,
  ...props
}: ToasterProps) {
  return (
    <SonnerToaster
      theme={theme}
      position={position}
      closeButton={closeButton}
      richColors={richColors}
      className={cn("font-sans", className)}
      style={{ ...tokenVariables, fontFamily: "var(--font-sans)" }}
      icons={{
        success: <IconCircleCheck {...iconProps} />,
        error: <IconCircleX {...iconProps} />,
        warning: <IconAlertTriangle {...iconProps} />,
        info: <IconInfoCircle {...iconProps} />,
        close: <IconX size={13} stroke={2} aria-hidden="true" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "!rounded-none !p-3.5 !gap-2.5",
          title: "!text-sm !font-semibold",
          description: "!text-xs !leading-relaxed",
          actionButton:
            "!rounded-none !bg-primary !text-primary-foreground !text-xs !font-semibold",
          cancelButton:
            "!rounded-none !bg-muted !text-foreground !text-xs !font-semibold",
          closeButton:
            "!rounded-none !border-border !bg-popover !text-muted-foreground hover:!text-foreground",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
