"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { DocsNavTree } from "@/components/docs-nav";

export function DocsSidebar() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Bring the current page into view when it is outside the visible part of
  // the list, about a third of the way down, without scrolling the document.
  useEffect(() => {
    const nav = ref.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !current) return;
    const list = nav.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.top >= list.top + 32 && item.bottom <= list.bottom - 56) return;
    nav.scrollTop += item.top - list.top - nav.clientHeight / 3;
  }, [pathname]);

  return (
    <div className="sticky top-16 hidden h-[calc(100dvh-4rem)] md:block">
      <nav
        ref={ref}
        aria-label="Documentation"
        className="-ml-3 h-full overflow-y-auto overscroll-contain border-r border-separator py-8 pr-4 [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-48px),transparent)] [scrollbar-width:thin]"
      >
        <DocsNavTree />
      </nav>
    </div>
  );
}
