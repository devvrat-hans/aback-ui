"use client";

import { useSyncExternalStore } from "react";

import { CopyButton, Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@aback-ui/ui";

const managers = ["npm", "pnpm", "yarn", "bun"] as const;
type Manager = (typeof managers)[number];

const STORAGE_KEY = "aback-ui:package-manager";
const EVENT = "aback-ui:package-manager";

// The runner each package manager uses for a one-off package binary.
const runners: Record<Manager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
};

const installers: Record<Manager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

function readManager(): Manager {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (managers as readonly string[]).includes(stored)) return stored as Manager;
  } catch {
    // A blocked storage API falls back to npm.
  }
  return "npm";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function chooseManager(manager: Manager) {
  try {
    window.localStorage.setItem(STORAGE_KEY, manager);
  } catch {
    // Not remembered; the tabs still switch for this page.
  }
  window.dispatchEvent(new Event(EVENT));
}

export type PackageCommandKind = "run" | "install";

/**
 * A command shown for npm, pnpm, yarn, and bun. The chosen manager is a
 * per-visitor convenience: it is remembered in this browser and every command
 * on the page switches together.
 *
 * `kind="run"` runs a package binary (`npx aback-ui@latest add button`);
 * `kind="install"` adds dependencies (`npm install ...`).
 */
export function PackageCommand({
  args,
  kind = "run",
  label = "Package manager",
  className,
}: {
  /** Everything after the runner or installer, such as "aback-ui@latest add button". */
  args: string;
  kind?: PackageCommandKind;
  label?: string;
  className?: string;
}) {
  const manager = useSyncExternalStore(subscribe, readManager, () => "npm" as Manager);

  return (
    <Tabs
      value={manager}
      onValueChange={(value) => chooseManager(value as Manager)}
      className={cn("gap-0 border border-border bg-muted/20", className)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pr-1.5">
        <TabsList aria-label={label} className="h-9 gap-0 border-0 bg-transparent p-0">
          {managers.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className="-mb-px h-9 border-b-2 border-transparent px-3 font-mono text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {managers.map((item) => {
        const command = `${kind === "run" ? runners[item] : installers[item]} ${args}`;
        return (
          <TabsContent key={item} value={item} className="mt-0">
            <div className="flex items-center gap-2 p-1.5 pl-3">
              <span aria-hidden="true" className="select-none font-mono text-xs text-muted-foreground">
                $
              </span>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
                {command}
              </code>
              <CopyButton value={command} label="Copy command" />
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
