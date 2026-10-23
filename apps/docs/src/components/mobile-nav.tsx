"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMenu2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { componentGroups } from "@/data/component-catalog";
import { gettingStartedNav } from "@/data/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <IconMenu2 aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm gap-0 p-0">
        <DialogTitle className="px-5 pt-5 text-base">Navigation</DialogTitle>
        <DialogDescription className="sr-only">
          Documentation pages and the component catalogue.
        </DialogDescription>
        <nav aria-label="Mobile" className="max-h-[70vh] overflow-y-auto px-3 pb-5 pt-3">
          <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Docs
          </p>
          {gettingStartedNav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}

          <p className="px-3 pb-1 pt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Components
          </p>
          <Link
            href="/docs/components"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            All components
          </Link>
          {componentGroups.map((group) => (
            <div key={group.category} className="pt-3">
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
                {group.category}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  href={`/docs/components/${item.name}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}

          <p className="px-3 pb-1 pt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Aback
          </p>
          <Link
            href="/built-with"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Built with Aback UI
          </Link>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
