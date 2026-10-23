"use client";

import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

function readStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function applyStoredTheme() {
  const stored = readStoredTheme();
  if (stored === "light") {
    document.documentElement.classList.remove("dark");
    return;
  }
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function onSystemChange() {
    const stored = readStoredTheme();
    if (stored === "light" || stored === "dark") return;
    applyStoredTheme();
    onChange();
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== "theme") return;
    applyStoredTheme();
    onChange();
  }

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener("themechange", onChange);

  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("themechange", onChange);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // A blocked storage API should not break the theme toggle.
    }
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <IconSun aria-hidden="true" className="size-4" />
      ) : (
        <IconMoon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
