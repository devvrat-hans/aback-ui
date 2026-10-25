"use client";

import { ThemeToggle, useTheme } from "@/components/ui/theme-toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeToggleExample() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <ThemeToggle variant="outline" />
        <span className="text-sm text-muted-foreground">
          Showing the <span className="font-medium text-foreground">{resolvedTheme}</span> theme.
          This toggle changes the whole site.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span id="theme-mode-label" className="text-sm font-medium">
          Appearance
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          aria-labelledby="theme-mode-label"
          value={theme}
          onValueChange={(next) => {
            if (next === "light" || next === "dark" || next === "system") setTheme(next);
          }}
        >
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
          <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
          <ToggleGroupItem value="system">System</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
