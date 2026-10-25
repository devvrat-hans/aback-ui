import Link from "next/link";

import { Logo } from "@/components/logo";
import { footerNav, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-separator bg-background">
      <div className="container-page grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:py-16">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {site.tagline} Built for Aback Group products, engineered for reuse, released for
            everyone.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Open source under the MIT license. Pre-1.0: APIs may change before the first stable
            release.
          </p>
        </div>

        {footerNav.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              {section.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  {item.file ? (
                    <a
                      href={item.href}
                      className="font-mono text-[13px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-muted/40">
        <div className="container-page flex flex-col gap-2 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Aback Group. The Aback name and mark are trademarks of
            Aback Group.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/license.txt" className="underline-offset-4 hover:text-foreground hover:underline">
              MIT licensed
            </a>
            <Link href="/docs/registry" className="underline-offset-4 hover:text-foreground hover:underline">
              Registry
            </Link>
            <span className="hidden h-3 w-px bg-separator sm:block" aria-hidden="true" />
            <span>Aback Group</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
