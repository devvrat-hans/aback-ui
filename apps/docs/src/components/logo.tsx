import Link from "next/link";

import { cn } from "@aback-ui/ui";

import { site } from "@/data/site";

/**
 * The Aback mark and the Aback UI wordmark. The mark is the same 128px PNG
 * Aback Tools and Aback Group ship, so the brand renders identically across
 * the products and in every browser.
 */
export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}) {
  const markSize = size === "sm" ? 24 : 32;
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <Link
      href="/"
      aria-label={showText ? undefined : `${site.name} home`}
      className={cn(
        "group flex items-center gap-2 font-bold tracking-tight text-foreground outline-none",
        "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <img
        src="/aback-logo-128.png"
        alt=""
        width={markSize}
        height={markSize}
        decoding="async"
        fetchPriority="high"
        className="shrink-0 object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {showText ? (
        <span className={cn(textSize, "whitespace-nowrap")}>
          Aback <span className="text-link transition-colors group-hover:text-link-hover">UI</span>
        </span>
      ) : null}
    </Link>
  );
}
