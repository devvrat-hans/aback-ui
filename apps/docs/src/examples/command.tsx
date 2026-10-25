"use client";

import { useState } from "react";
import { IconBox, IconLayoutGrid, IconMoon, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandExample() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  function run(action: string) {
    setLastAction(action);
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
        <CommandShortcut className="ml-2 text-foreground">⌘K</CommandShortcut>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search components" />
        <CommandList>
          <CommandEmpty>No matching command.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem value="components" onSelect={() => run("components")}>
              <IconLayoutGrid aria-hidden="true" />
              Browse components
            </CommandItem>
            <CommandItem value="blocks" onSelect={() => run("blocks")}>
              <IconBox aria-hidden="true" />
              Browse blocks
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="create" onSelect={() => run("create")}>
              <IconPlus aria-hidden="true" />
              Create component
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem value="theme" onSelect={() => run("theme")}>
              <IconMoon aria-hidden="true" />
              Toggle theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <p role="status" className="text-sm text-muted-foreground">
        {lastAction ? `Ran: ${lastAction}` : "Keyboard first: ↑ ↓ to move, Enter to run, Esc to close."}
      </p>
    </div>
  );
}
