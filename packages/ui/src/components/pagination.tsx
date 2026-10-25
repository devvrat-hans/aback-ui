import * as React from "react";

import { cn } from "../lib/utils";

export interface PaginationLabels {
  previous?: string;
  next?: string;
  navigation?: string;
}

export interface PaginationProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Render links instead of buttons. Use this for server-rendered pages. */
  hrefFor?: (page: number) => string;
  siblingCount?: number;
  labels?: PaginationLabels;
}

type PageItem = number | "ellipsis";

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

export function getPageItems(
  page: number,
  pageCount: number,
  siblingCount = 1,
): PageItem[] {
  const total = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), total);
  const visible = siblingCount * 2 + 5;

  if (total <= visible) return range(1, total);

  const left = Math.max(2, current - siblingCount);
  const right = Math.min(total - 1, current + siblingCount);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const count = 3 + siblingCount * 2;
    return [...range(1, count), "ellipsis", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const count = 3 + siblingCount * 2;
    return [1, "ellipsis", ...range(total - count + 1, total)];
  }

  return [1, "ellipsis", ...range(left, right), "ellipsis", total];
}

const base =
  "inline-flex h-8 min-w-8 items-center justify-center border px-2 text-sm font-medium tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function Pagination({
  page,
  pageCount,
  onPageChange,
  hrefFor,
  siblingCount = 1,
  labels,
  className,
  ...props
}: PaginationProps) {
  const total = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), total);
  const items = getPageItems(current, total, siblingCount);

  function renderItem(target: number, label: React.ReactNode, key: string, disabled = false) {
    const isCurrent = target === current;

    if (isCurrent) {
      return (
        <span
          key={key}
          aria-current="page"
          className={cn(base, "border-primary bg-primary text-primary-foreground")}
        >
          {label}
        </span>
      );
    }

    if (disabled) {
      return (
        <span
          key={key}
          aria-disabled="true"
          className={cn(base, "border-border text-muted-foreground opacity-50")}
        >
          {label}
        </span>
      );
    }

    const common = {
      "aria-label": typeof label === "string" ? label : `Go to page ${label}`,
      className: cn(base, "border-border bg-background text-foreground hover:bg-muted"),
    };

    if (hrefFor) {
      return (
        <a key={key} href={hrefFor(target)} {...common}>
          {label}
        </a>
      );
    }

    return (
      <button key={key} type="button" onClick={() => onPageChange?.(target)} {...common}>
        {label}
      </button>
    );
  }

  return (
    <nav
      aria-label={labels?.navigation ?? "Pagination"}
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      {renderItem(current - 1, labels?.previous ?? "Previous", "previous", current <= 1)}
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          renderItem(item, item, `page-${item}`)
        ),
      )}
      {renderItem(current + 1, labels?.next ?? "Next", "next", current >= total)}
    </nav>
  );
}

export { Pagination };
