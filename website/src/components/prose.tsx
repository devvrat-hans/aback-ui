import Link from "next/link";

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
