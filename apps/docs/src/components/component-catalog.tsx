"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconSearch, IconX } from "@tabler/icons-react";

import {
  Badge,
  Button,
  EmptyState,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  ToggleGroup,
  ToggleGroupItem,
} from "@aback-ui/ui";

export interface CatalogItem {
  name: string;
  title: string;
  description: string;
  category: string;
  status: string;
  usedIn: string[];
}

// Every query word must start a word in the item, so "date" finds Date Picker
// but not "validates".
function matches(item: CatalogItem, query: string) {
  if (!query) return true;
  const words = `${item.title} ${item.name} ${item.description} ${item.category}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => words.some((word) => word.startsWith(term)));
}

/**
 * The searchable component catalogue. Every card is a real link, so the
 * list works as plain navigation before the filter hydrates.
 */
export function ComponentCatalog({
  items,
  categories,
}: {
  items: CatalogItem[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const deferredQuery = useDeferredValue(query.trim());

  const groups = useMemo(
    () =>
      categories
        .filter((name) => category === "all" || name === category)
        .map((name) => ({
          name,
          items: items.filter((item) => item.category === name && matches(item, deferredQuery)),
        }))
        .filter((group) => group.items.length > 0),
    [categories, category, items, deferredQuery],
  );
  const count = groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label htmlFor="catalog-search" className="sr-only">
          Filter components
        </label>
        <InputGroup className="max-w-md">
          <InputGroupAddon variant="inline">
            <IconSearch aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="catalog-search"
            type="search"
            placeholder="Filter by name or purpose, such as date or upload"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby="catalog-count"
            className="[&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <InputGroupAddon align="end" variant="inline">
              <Button variant="ghost" size="icon-xs" aria-label="Clear filter" onClick={() => setQuery("")}>
                <IconX aria-hidden="true" />
              </Button>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
        <div className="overflow-x-auto pb-1">
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            aria-label="Category"
            value={category}
            onValueChange={(value) => setCategory(value || "all")}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            {categories.map((name) => (
              <ToggleGroupItem key={name} value={name}>
                {name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <p id="catalog-count" role="status" className="text-xs text-muted-foreground">
          {count === items.length ? `${count} components` : `${count} of ${items.length} components`}
        </p>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={<IconSearch aria-hidden="true" />}
          title="No components match"
          description="Try a shorter word, or clear the filter to see everything."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.name} aria-labelledby={`category-${group.name}`}>
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-2">
                <h2
                  id={`category-${group.name}`}
                  className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
                >
                  {group.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "component" : "components"}
                </span>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={`/docs/components/${item.name}`}
                      className="group flex h-full flex-col gap-2 border border-border p-4 outline-none transition-colors hover:border-primary-300 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground group-hover:text-link">
                          {item.title}
                        </span>
                        <IconArrowRight
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link motion-reduce:group-hover:translate-x-0"
                        />
                      </span>
                      <span className="text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                      <span className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant={item.status === "stable" ? "success" : "info"} dot>
                          {item.status === "stable" ? "Stable" : "Beta"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {item.usedIn.length ? `Used in ${item.usedIn.join(", ")}` : "New shared pattern"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
