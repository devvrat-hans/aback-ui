"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle, cn } from "@aback-ui/ui";

import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { SearchDialog } from "@/components/search-dialog";
import { mainNav } from "@/data/site";
import { searchItems } from "@/data/search";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/95 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center gap-2">
        <MobileNav />
        <Logo className="mr-3 lg:mr-5" />

        <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
          {mainNav.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center px-3 text-sm font-medium transition-colors duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  active
                    ? "bg-brand-wash text-link"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchDialog items={searchItems} />
          <span aria-hidden="true" className="mx-1.5 hidden h-5 w-px bg-border sm:block" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
