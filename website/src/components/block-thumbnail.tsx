"use client";

import { useEffect, useRef } from "react";

import { cn } from "@aback-ui/ui";

/**
 * A live, scaled-down render of a block at a desktop width. It is the real
 * preview route in an inert iframe: it cannot take focus or clicks and is
 * hidden from assistive technology, because the surrounding link carries the
 * name and the destination.
 */
export function BlockThumbnail({
  slug,
  title,
  width = 1280,
  height = 800,
  className,
}: {
  slug: string;
  title: string;
  /** The logical viewport the block renders at, in CSS pixels. */
  width?: number;
  height?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      element.style.setProperty("--thumb-scale", String(entry.contentRect.width / width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className={cn("relative w-full overflow-hidden bg-background [--thumb-scale:0.3]", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Shows until the frame paints its own background over it. */}
      <div className="absolute inset-0 bg-muted/60" />
      <iframe
        src={`/view/blocks/${slug}`}
        title={`${title} thumbnail`}
        loading="lazy"
        tabIndex={-1}
        inert
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
        style={{ width, height, transform: "scale(var(--thumb-scale))" }}
      />
    </div>
  );
}
