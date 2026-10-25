"use client";

import { useState, type ReactNode } from "react";
import {
  IconChevronDown,
  IconLogout,
  IconMenu,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface DashboardNavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  /** A short count or state, such as an unread total. */
  badge?: string;
}

export interface DashboardUser {
  name: string;
  email: string;
  initials?: string;
}

export interface DashboardShellProps {
  children: ReactNode;
  nav: DashboardNavItem[];
  /** The `href` of the current section. Matched exactly. */
  activeHref?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  appName?: string;
  user?: DashboardUser;
  /** A real destination for account settings. The menu item is omitted when absent. */
  accountHref?: string;
  onSignOut?: () => void;
  /** Renders a search trigger in the top bar when provided. */
  onSearch?: () => void;
}

function initialsFor(user: DashboardUser) {
  if (user.initials) return user.initials;
  return user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function NavLinks({
  nav,
  activeHref,
  onNavigate,
}: {
  nav: DashboardNavItem[];
  activeHref?: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = item.href === activeHref;
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={
                active
                  ? "flex items-center gap-2.5 border-l-2 border-primary-500 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors dark:bg-primary-950/40 dark:text-primary-300"
                  : "flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              }
            >
              {item.icon ? (
                <span aria-hidden="true" className="shrink-0 [&_svg]:size-4">
                  {item.icon}
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              {item.badge ? (
                <span className="shrink-0 bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                  {item.badge}
                </span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function UserMenu({
  user,
  accountHref,
  onSignOut,
}: {
  user: DashboardUser;
  accountHref?: string;
  onSignOut?: () => void;
}) {
  const identity = (
    <>
      <Avatar size="sm">
        <AvatarFallback aria-hidden="true">{initialsFor(user)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
      </span>
    </>
  );

  if (!accountHref && !onSignOut) {
    return <div className="flex items-center gap-2.5">{identity}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 p-1 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
          aria-label={`Account menu for ${user.name}`}
        >
          {identity}
          <IconChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate text-sm font-medium">{user.name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountHref ? (
          <DropdownMenuItem asChild>
            <a href={accountHref}>
              <IconSettings aria-hidden="true" />
              Account settings
            </a>
          </DropdownMenuItem>
        ) : null}
        {onSignOut ? (
          <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
            <IconLogout aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * A responsive application shell: a persistent sidebar from `md` up, a sheet
 * below it, a top bar, and the page header. It owns no routing, data, or auth.
 * Pass real `href`s, your user, and the page content; `onSearch` and
 * `onSignOut` are optional, so the shell never renders a control without an
 * action behind it.
 *
 * The content region is a div, not a landmark. Wrap the shell in your app's
 * `<main>`, or replace the content container with `<main>` when the shell owns
 * the whole page.
 */
export function DashboardShellBlock({
  children,
  nav,
  activeHref,
  title,
  description,
  actions,
  appName = "Aback",
  user,
  accountHref,
  onSignOut,
  onSearch,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandMark = (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center bg-primary text-[11px] font-bold text-primary-foreground"
    >
      {appName.slice(0, 1).toUpperCase()}
    </span>
  );

  return (
    <div className="flex min-h-[640px] w-full border border-border bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          {brandMark}
          <span className="truncate text-sm font-semibold">{appName}</span>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto p-2">
          <NavLinks nav={nav} activeHref={activeHref} />
        </nav>

        {user ? (
          <div className="border-t border-border p-2.5">
            <UserMenu user={user} accountHref={accountHref} onSignOut={onSignOut} />
          </div>
        ) : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open navigation">
                <IconMenu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
                  {brandMark}
                  {appName}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Sections available in {appName}.
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Primary" className="p-2">
                <NavLinks
                  nav={nav}
                  activeHref={activeHref}
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
              {user ? (
                <div className="mt-auto border-t border-border p-3">
                  <UserMenu user={user} accountHref={accountHref} onSignOut={onSignOut} />
                </div>
              ) : null}
            </SheetContent>
          </Sheet>

          <span className="truncate text-sm font-semibold md:hidden">{appName}</span>

          {onSearch ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onSearch}
              className="ml-auto gap-2 text-muted-foreground"
            >
              <IconSearch aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <span className="sr-only sm:hidden">Search</span>
            </Button>
          ) : null}

          {user ? (
            <div className="ml-auto md:hidden">
              <UserMenu user={user} accountHref={accountHref} onSignOut={onSignOut} />
            </div>
          ) : null}
        </header>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-5 sm:px-6">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
              {description ? (
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
          </div>

          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
