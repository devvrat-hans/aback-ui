"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { IconBook, IconBox, IconLayoutGrid, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import type { SearchItem } from "@/data/search";

const GROUP_ICONS = {
  Blocks: IconLayoutGrid,
  Docs: IconBook,
} as const;

function GroupIcon({ group }: { group: string }) {
  const Icon = GROUP_ICONS[group as keyof typeof GROUP_ICONS] ?? IconBox;
  return <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />;
}

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const modifier = useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<string, SearchItem[]>();
    for (const item of items) {
      const list = groups.get(item.group) ?? [];
      list.push(item);
      groups.set(item.group, list);
    }
    return Array.from(groups.entries());
  }, [items]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuery("");
  }

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 bg-muted/40 px-2.5 text-muted-foreground hover:bg-muted sm:w-52 sm:justify-start md:w-9 md:justify-center md:px-0 lg:w-64 lg:justify-start lg:px-2.5 xl:w-72"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
      >
        <IconSearch aria-hidden="true" />
        {/* The visible text is the accessible name; at icon-only widths it stays for screen readers. */}
        <span className="sr-only min-w-0 flex-1 text-left font-normal sm:not-sr-only md:sr-only lg:not-sr-only">
          <span className="block truncate">Search documentation</span>
        </span>
        <span aria-hidden="true" className="ml-auto hidden items-center gap-1 sm:flex md:hidden lg:flex">
          <Kbd>{modifier}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search documentation"
        description="Search components, blocks, tokens, and guides."
        showCloseButton={false}
        className="top-[10%] max-w-[660px] translate-y-0 sm:top-[14%]"
      >
        <CommandInput
          autoFocus
          value={query}
          onValueChange={setQuery}
          placeholder="Search components, blocks, and docs"
          wrapperClassName="h-12 px-4"
        />

        <CommandList className="max-h-[420px] p-2">
          <CommandEmpty className="px-6 py-12">
            <span className="mx-auto mb-3 flex size-12 items-center justify-center bg-muted text-muted-foreground">
              <IconSearch aria-hidden="true" className="size-6" />
            </span>
            <p className="text-sm font-semibold text-foreground">
              No results for “{query}”
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a component name, or browse the full catalogue.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/docs/components")}
            >
              Browse components
            </Button>
          </CommandEmpty>

          {grouped.map(([group, groupItems]) => (
            <CommandGroup key={group} heading={group}>
              {groupItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.title} ${item.description} ${item.group}`}
                  onSelect={() => navigate(item.href)}
                  className="gap-3 px-2.5 py-2.5"
                >
                  <GroupIcon group={group} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.title}</span>
                    {item.description ? (
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>

        <div className="flex items-center gap-4 border-t border-border bg-muted/20 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            Open
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            Close
          </span>
          <span className="ml-auto hidden sm:inline">{items.length} entries</span>
        </div>
      </CommandDialog>
    </>
  );
}
