"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { blocks } from "@/data/blocks";
import { componentGroups } from "@/data/component-catalog";
import { gettingStartedNav } from "@/data/site";
import { cn } from "@aback-ui/ui";

function rowClass(active: boolean) {
  return cn(
    "flex items-center justify-between px-3 py-2 text-sm transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
    active
      ? "bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-separator px-3 py-6 lg:block">
      <nav aria-label="Documentation">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Getting started
        </p>
        <ul className="space-y-0.5">
          {gettingStartedNav.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={rowClass(pathname === item.href)}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Components
          </p>
          <Link
            href="/docs/components"
            aria-current={pathname === "/docs/components" ? "page" : undefined}
            className={rowClass(pathname === "/docs/components")}
          >
            All components
            <span className="text-xs font-normal tabular-nums text-muted-foreground">
              {componentGroups.reduce((count, group) => count + group.items.length, 0)}
            </span>
          </Link>

          {componentGroups.map((group) => (
            <div key={group.category} className="mt-4">
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
                {group.category}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const href = `/docs/components/${item.name}`;
                  return (
                    <li key={item.name}>
                      <Link
                        href={href}
                        aria-current={pathname === href ? "page" : undefined}
                        className={rowClass(pathname === href)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Blocks
          </p>
          <Link
            href="/docs/blocks"
            aria-current={pathname === "/docs/blocks" ? "page" : undefined}
            className={rowClass(pathname === "/docs/blocks")}
          >
            All blocks
            <span className="text-xs font-normal tabular-nums text-muted-foreground">
              {blocks.length}
            </span>
          </Link>
          <ul className="mt-1 space-y-0.5">
            {blocks.map((block) => {
              const href = `/docs/blocks/${block.name}`;
              return (
                <li key={block.name}>
                  <Link
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    className={rowClass(pathname === href)}
                  >
                    {block.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 border-t border-separator pt-4">
          <Link href="/built-with" className={rowClass(pathname === "/built-with")}>
            Built with Aback UI
          </Link>
        </div>
      </nav>
    </aside>
  );
}
