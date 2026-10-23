"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { searchItems } from "@/data/search";

const links = [
  { title: "Docs", href: "/docs", exact: true },
  { title: "Components", href: "/docs/components", exact: false },
  { title: "Tokens", href: "/docs/tokens", exact: true },
  { title: "Built with", href: "/built-with", exact: true },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 md:px-6">
        <MobileNav />
        <Logo />

        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "flex h-9 items-center bg-primary-50 px-3 text-sm font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                    : "flex h-9 items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                }
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <SearchDialog items={searchItems} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
