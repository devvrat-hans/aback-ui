import Link from "next/link";

import { cn } from "@aback-ui/ui";

import { site } from "@/data/site";

export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}) {
  const markSize = size === "sm" ? "size-6" : "size-8";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <Link
      href="/"
      aria-label={showText ? undefined : site.name}
      className={cn(
        "group flex items-center gap-2.5 font-bold tracking-tight text-primary-700 outline-none",
        "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "dark:text-primary-400",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block shrink-0 bg-current transition-transform duration-200 group-hover:scale-105",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          markSize,
        )}
        style={{
          maskImage: "url(/aback-mark.svg)",
          WebkitMaskImage: "url(/aback-mark.svg)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      {showText ? (
        <span className={cn(textSize, "transition-colors group-hover:text-primary-800 dark:group-hover:text-primary-300")}>
          {site.name}
        </span>
      ) : null}
    </Link>
  );
}
