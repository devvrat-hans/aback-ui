"use client";

import * as React from "react";
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react";

import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";

/**
 * Writes text to the clipboard. Falls back to a temporary textarea and
 * `execCommand("copy")` where the async Clipboard API is unavailable, such as
 * an insecure origin or an older embedded browser. Rejects when both fail.
 */
async function copyToClipboard(value: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) throw new Error("Copy failed");
}

type CopyState = "idle" | "copied" | "error";

export interface CopyButtonProps
  extends Omit<ButtonProps, "value" | "onClick" | "children" | "asChild" | "onCopy"> {
  /** The exact text written to the clipboard. An empty string disables the button. */
  value: string;
  /** Accessible name and visible text before copying. */
  label?: string;
  /** Text shown and announced after a successful copy. */
  copiedLabel?: string;
  /** Text shown and announced when the browser refuses the write. */
  errorLabel?: string;
  /** Render the label next to the icon instead of an icon-only button. */
  showLabel?: boolean;
  /** How long the copied or error state stays visible, in milliseconds. */
  timeout?: number;
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
}

/**
 * Copies a value and confirms it in place: the icon and label swap for a
 * moment, and a polite live region announces the result. It never toasts,
 * so the confirmation stays next to the thing that was copied.
 */
function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Copy failed",
  showLabel = false,
  timeout = 2000,
  onCopy,
  onCopyError,
  variant = "ghost",
  size,
  disabled,
  className,
  ...props
}: CopyButtonProps) {
  const [state, setState] = React.useState<CopyState>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function settle(next: CopyState) {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), timeout);
  }

  async function handleClick() {
    try {
      await copyToClipboard(value);
      settle("copied");
      onCopy?.(value);
    } catch (error) {
      settle("error");
      onCopyError?.(error);
    }
  }

  const currentLabel = state === "copied" ? copiedLabel : state === "error" ? errorLabel : label;
  const Icon = state === "copied" ? IconCheck : state === "error" ? IconX : IconCopy;

  return (
    <>
      <Button
        type="button"
        data-slot="copy-button"
        data-state={state}
        variant={variant}
        size={size ?? (showLabel ? "sm" : "icon-sm")}
        disabled={disabled || value.length === 0}
        aria-label={showLabel ? undefined : currentLabel}
        title={showLabel ? undefined : currentLabel}
        onClick={handleClick}
        className={cn(className)}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            state === "copied" && "text-success",
            state === "error" && "text-danger",
          )}
        />
        {showLabel ? <span>{currentLabel}</span> : null}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? `${copiedLabel} to clipboard` : state === "error" ? errorLabel : ""}
      </span>
    </>
  );
}

export { CopyButton, copyToClipboard };
