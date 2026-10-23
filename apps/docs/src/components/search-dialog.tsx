"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconBolt, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import type { SearchItem } from "@/data/search";

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

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
        setActive(0);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items.slice(0, 9);
    return items
      .filter((item) =>
        `${item.title} ${item.description} ${item.group}`.toLowerCase().includes(term),
      )
      .slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`#search-option-${active}`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Array<SearchItem & { index: number }>>();
    results.forEach((item, index) => {
      const list = groups.get(item.group) ?? [];
      list.push({ ...item, index });
      groups.set(item.group, list);
    });
    return Array.from(groups.entries());
  }, [results]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    setActive(0);
    if (!next) setQuery("");
  }

  function navigate(item: SearchItem) {
    setOpen(false);
    setQuery("");
    setActive(0);
    router.push(item.href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (results.length ? (current + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      const item = results[active];
      if (item) {
        event.preventDefault();
        navigate(item);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 px-2.5 text-muted-foreground sm:w-56 sm:justify-start"
          aria-label="Search documentation"
        >
          <IconSearch aria-hidden="true" />
          <span className="hidden flex-1 text-left font-normal sm:inline">Search</span>
          <span className="ml-auto hidden items-center gap-1 sm:flex">
            <Kbd>{modifier}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="top-[10%] max-w-[660px] translate-y-0 gap-0 p-0 sm:top-[14%]"
      >
        <DialogTitle className="sr-only">Search documentation</DialogTitle>
        <DialogDescription className="sr-only">
          Search components, token documentation, and guides.
        </DialogDescription>

        <div
          aria-hidden="true"
          className="h-0.5 bg-gradient-to-r from-primary-500/80 via-primary-400/60 to-primary-500/80"
        />

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
            <IconSearch aria-hidden="true" className="size-4" />
          </span>
          <input
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={
              results.length ? `search-option-${active}` : undefined
            }
            aria-autocomplete="list"
            aria-label="Search components and docs"
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search components, tokens, and docs"
            className="h-9 min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-[420px] overflow-y-auto py-2"
        >
          {grouped.length ? (
            grouped.map(([group, groupItems]) => (
              <div key={group} role="group" aria-label={group}>
                <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {group}
                </p>
                {groupItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    id={`search-option-${item.index}`}
                    role="option"
                    aria-selected={item.index === active}
                    onMouseEnter={() => setActive(item.index)}
                    onClick={() => navigate(item)}
                    className={
                      item.index === active
                        ? "relative flex w-full items-center gap-3 border-l-2 border-primary-500 bg-primary-50/80 px-4 py-2.5 text-left dark:bg-primary-950/30"
                        : "flex w-full items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-left hover:bg-muted/60"
                    }
                  >
                    <span
                      className={
                        item.index === active
                          ? "flex size-8 shrink-0 items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                          : "flex size-8 shrink-0 items-center justify-center bg-muted text-muted-foreground"
                      }
                    >
                      <IconBolt aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={
                          item.index === active
                            ? "block truncate text-sm font-semibold text-primary-700 dark:text-primary-300"
                            : "block truncate text-sm font-semibold text-foreground"
                        }
                      >
                        {item.title}
                      </span>
                      <span
                        className={
                          item.index === active
                            ? "mt-0.5 block truncate text-xs text-foreground"
                            : "mt-0.5 block truncate text-xs text-muted-foreground"
                        }
                      >
                        {item.description}
                      </span>
                    </span>
                    <IconArrowRight
                      aria-hidden="true"
                      className={
                        item.index === active
                          ? "size-4 shrink-0 text-primary-600 dark:text-primary-400"
                          : "size-4 shrink-0 text-muted-foreground opacity-0"
                      }
                    />
                  </button>
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
                <IconSearch aria-hidden="true" className="size-6" />
              </span>
              <p className="text-sm font-semibold text-foreground">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground">
                Try a component name, or browse the full catalogue.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  handleOpenChange(false);
                  router.push("/docs/components");
                }}
              >
                Browse components
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border bg-muted/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
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
      </DialogContent>
    </Dialog>
  );
}
