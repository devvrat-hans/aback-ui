import type { ReactNode } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

export interface SiteFooterLink {
  title: string;
  href: string;
  /** Opens in a new tab with noopener and marks the link as external. */
  external?: boolean;
}

export interface SiteFooterColumn {
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterBlockProps {
  brand: ReactNode;
  /** One or two sentences about the product. */
  tagline?: ReactNode;
  columns: SiteFooterColumn[];
  /** The copyright line, such as "© 2026 Acme Inc." */
  copyright: ReactNode;
  /** Privacy, terms, and similar links in the bottom bar. */
  legal?: SiteFooterLink[];
}

function FooterLink({ link, className }: { link: SiteFooterLink; className: string }) {
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className={className}
    >
      {link.title}
      {link.external ? (
        <>
          <IconArrowUpRight aria-hidden="true" className="size-3" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}

const linkClass =
  "inline-flex items-center gap-1 text-xs text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * A site footer with a brand column, link columns, and a legal bar. Columns
 * collapse to two on tablets and one on phones. It renders the page's
 * contentinfo landmark, so use it once per page.
 */
export function SiteFooterBlock({ brand, tagline, columns, copyright, legal = [] }: SiteFooterBlockProps) {
  return (
    <footer className="border-t border-separator bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-10 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          {brand}
          {tagline ? (
            <p className="max-w-[34ch] text-xs leading-relaxed text-muted-foreground">{tagline}</p>
          ) : null}
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} className={linkClass} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="bg-muted/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left md:px-6">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          {legal.length ? (
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {legal.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} className={linkClass} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
