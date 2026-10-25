import * as React from "react";

import { cn } from "../lib/utils";

export interface SkipLinkProps extends React.ComponentProps<"a"> {
  /** The id of the main content, with its hash. */
  href?: string;
}

/**
 * The first focusable element on a page. It stays hidden until it receives
 * keyboard focus, then lets a keyboard or switch user jump past the header.
 * The target needs a matching id, and `tabIndex={-1}` if it is not focusable.
 */
function SkipLink({
  href = "#main-content",
  children = "Skip to content",
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      data-slot="skip-link"
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]",
        "focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg",
        "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export { SkipLink };
