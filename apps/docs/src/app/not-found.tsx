import Link from "next/link";
import { IconArrowRight, IconHome, IconSearch } from "@tabler/icons-react";

import { Badge, Button } from "@aback-ui/ui";

import { SiteChrome } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <SiteChrome>
    <div className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 lg:py-24">
      <div className="border border-border bg-card p-6 md:p-10">
        <Badge variant="brand">Error 404</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          The page you followed does not exist. It may have moved, or a registry item may have been
          renamed. Try the component catalogue or the documentation index.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/">
              <IconHome aria-hidden="true" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/components">Browse components</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Popular destinations
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { href: "/docs/installation", title: "Installation", description: "Add the theme and your first component." },
              { href: "/docs/registry", title: "Registry", description: "How source-copy installation works." },
              { href: "/docs/tokens", title: "Design tokens", description: "Color, type, spacing, and shape." },
              { href: "/built-with", title: "Built with Aback UI", description: "The Aback products behind the system." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-3 border border-border p-3 transition-colors hover:border-primary-300 hover:bg-muted/40"
              >
                <span>
                  <span className="block text-sm font-medium text-foreground group-hover:text-link">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <IconArrowRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-link"
                />
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconSearch aria-hidden="true" className="size-3.5" />
          You can also search from the header with Ctrl or Command K.
        </p>
      </div>
    </div>
    </SiteChrome>
  );
}
