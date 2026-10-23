"use client";

import { Kbd } from "@/components/ui/kbd";

const shortcuts = [
  { label: "Open search", keys: ["Ctrl", "K"] },
  { label: "Save changes", keys: ["Ctrl", "S"] },
  { label: "Close dialog", keys: ["Esc"] },
];

export function KbdExample() {
  return (
    <dl className="flex max-w-sm flex-col divide-y divide-border border border-border">
      {shortcuts.map((shortcut) => (
        <div key={shortcut.label} className="flex items-center justify-between gap-4 px-3 py-2.5">
          <dt className="text-sm text-foreground">{shortcut.label}</dt>
          <dd className="flex items-center gap-1">
            {shortcut.keys.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
