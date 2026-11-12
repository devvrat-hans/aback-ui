import Link from "next/link";
import { IconBrandGithub, IconBrandNpm } from "@tabler/icons-react";

import { Button } from "@aback-ui/ui";

import { Logo } from "@/components/logo";
import { footerNav, site } from "@/data/site";

const linkClass =
  "text-sm text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline";

export function SiteFooter() {
  return (
    <footer className="border-t border-separator bg-background">
      <div className="container-page py-12 lg:py-16">
        <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="max-w-md">
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
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={site.repository} target="_blank" rel="noopener noreferrer">
                <IconBrandGithub aria-hidden="true" />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={site.npm} target="_blank" rel="noopener noreferrer">
                <IconBrandNpm aria-hidden="true" />
                npm
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-8 gap-y-10 pt-10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {footerNav.map((section) => (
            <div key={section.title}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    {item.file ? (
                      <a href={item.href} className={`${linkClass} font-mono text-[13px]`}>
                        {item.title}
                      </a>
                    ) : item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {item.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={item.href} className={linkClass}>
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
