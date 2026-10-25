"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  cn,
} from "@aback-ui/ui";

import { DocsNavTree } from "@/components/docs-nav";
import { Logo } from "@/components/logo";
import { mainNav } from "@/data/site";

/** The left drawer that carries the full navigation below the md breakpoint. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ml-2 md:hidden" aria-label="Open navigation">
          <IconMenu2 aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 max-w-[85vw] gap-0 p-0">
        <div className="flex h-16 shrink-0 items-center border-b border-separator px-4" onClick={close}>
          <Logo />
        </div>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Documentation pages, blocks, and the component catalogue.
        </SheetDescription>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 pb-10 pt-5">
          <ul className="mb-7 grid grid-cols-2 gap-1.5">
            {mainNav.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center border px-3 text-sm font-medium transition-colors duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                      active
                        ? "border-primary-300 bg-brand-wash text-link dark:border-primary-700"
                        : "border-border text-foreground hover:bg-muted",
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <DocsNavTree onNavigate={close} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
