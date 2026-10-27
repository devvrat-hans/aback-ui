import Link from "next/link";

import { cn } from "@aback-ui/ui";

/**
 * Long-form article typography for blog posts. Posts write plain h2, h3, p,
 * ul, ol, blockquote, table, and code elements; this wrapper styles them
 * with the theme tokens so posts never carry their own colours or sizes.
 */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-[70ch] text-[17px] leading-[1.75] text-foreground/90",
        "[&>*+*]:mt-5",
        "[&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li+li]:mt-2 [&_li]:pl-1",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary-300 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground dark:[&_blockquote]:border-primary-500",
        "[&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.88em] [&_:not(pre)>code]:text-foreground",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** An in-text link. Internal paths use the router; anything else opens as a normal external link. */
export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "font-medium text-link underline underline-offset-4 hover:text-link-hover";
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** A short answer box at the top of a post, written to be quoted on its own. */
export function KeyTakeaways({ items }: { items: React.ReactNode[] }) {
  return (
    <aside aria-label="Key takeaways" className="border border-border bg-muted/40 p-5 text-[15px] leading-relaxed">
      <p className="text-xs font-semibold uppercase tracking-wide text-link">Key takeaways</p>
      <ul className="mt-3 list-disc pl-5 [&>li+li]:mt-1.5">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
