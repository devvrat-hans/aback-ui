"use client";

import { useSyncExternalStore } from "react";

import { Toaster } from "@/components/ui/toaster";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * The docs site owns one toast surface so every example shares it. Sonner
 * defaults to `prefers-color-scheme`; this site's theme is a class on <html>,
 * so the snapshot is read from that class instead.
 */
export function DocsToaster() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as const);

  return <Toaster theme={theme} />;
}
