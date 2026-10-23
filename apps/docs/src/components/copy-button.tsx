"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
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

export function CopyButton({
  value,
  label = "Copy",
  className,
  showLabel = false,
}: {
  value: string;
  label?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  async function copy() {
    try {
      await writeClipboard(value);
      setCopied(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={showLabel ? "sm" : "icon-sm"}
        onClick={copy}
        aria-label={copied ? "Copied" : label}
        className={className}
      >
        {copied ? (
          <IconCheck aria-hidden="true" className="text-success" />
        ) : (
          <IconCopy aria-hidden="true" />
        )}
        {showLabel ? <span>{copied ? "Copied" : "Copy"}</span> : null}
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
