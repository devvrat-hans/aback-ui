"use client";

import { useState, type ReactNode } from "react";
import { IconMenu2, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export interface SiteHeaderLink {
  title: string;
  href: string;
}

export interface SiteHeaderBlockProps {
  /** Your logo and name, usually a link home. */
  brand: ReactNode;
  links: SiteHeaderLink[];
  /** The href of the current section. A link is active when the path starts with it. */
  activePath?: string;
  /** Primary actions on the right, such as a sign-in link or a CTA. */
  actions?: ReactNode;
  /** Renders a search trigger. Omit it and no search control appears. */
  onSearch?: () => void;
  /** Shortcut shown on the search trigger. Only show one you actually bind. */
  searchShortcut?: string;
  showThemeToggle?: boolean;
}

function isActive(activePath: string | undefined, href: string) {
  if (!activePath) return false;
  if (href === "/") return activePath === "/";
  return activePath === href || activePath.startsWith(`${href.replace(/\/$/, "")}/`);
}

function linkClass(active: boolean) {
  return cn(
    "inline-flex h-9 items-center px-3 text-sm font-medium outline-none transition-colors duration-200",
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    active
      ? "bg-brand-wash text-link"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

/**
 * A sticky site header: brand, primary navigation, optional search, theme
 * toggle, and actions. Below md the links move into a sheet. Links are plain
 * anchors; swap them for your router's link component.
 */
export function SiteHeaderBlock({
  brand,
  links,
  activePath,
  actions,
  onSearch,
  searchShortcut,
  showThemeToggle = true,
}: SiteHeaderBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-separator bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 md:px-6">
        <div className="shrink-0">{brand}</div>

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActive(activePath, link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                {link.title}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {onSearch ? (
            <>
              <button
                type="button"
                onClick={onSearch}
                className="hidden h-9 w-52 items-center gap-2 border border-border bg-muted/30 px-3 text-sm text-muted-foreground outline-none transition-colors duration-200 hover:border-primary-300 hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:flex"
              >
                <IconSearch aria-hidden="true" className="size-4" />
                <span className="flex-1 text-left">Search</span>
                {searchShortcut ? <Kbd>{searchShortcut}</Kbd> : null}
              </button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={onSearch}
                className="lg:hidden"
              >
                <IconSearch aria-hidden="true" />
              </Button>
            </>
          ) : null}

          {showThemeToggle ? <ThemeToggle /> : null}

          {actions ? (
            <>
              <span aria-hidden="true" className="mx-2 hidden h-5 w-px bg-border md:block" />
              <div className="hidden items-center gap-2 md:flex">{actions}</div>
            </>
          ) : null}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
                <IconMenu2 aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 p-0">
              <SheetHeader className="h-16 justify-center border-b border-separator px-4">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
                {links.map((link) => {
                  const active = isActive(activePath, link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(linkClass(active), "h-10 w-full")}
                    >
                      {link.title}
                    </a>
                  );
                })}
              </nav>
              {actions ? (
                <div className="mt-auto flex flex-col gap-2 border-t border-separator p-4 [&>*]:w-full">
                  {actions}
                </div>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
