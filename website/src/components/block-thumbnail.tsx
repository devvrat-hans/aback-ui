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
  const frame = useRef<HTMLIFrameElement>(null);

  // Stops the placeholder's pulse. It is written to the DOM, like the scale,
  // so a thumbnail never re-renders for it.
  function markLoaded() {
    box.current?.setAttribute("data-loaded", "true");
  }

  // A frame near the viewport can finish loading before this component
  // hydrates, and its load event is not replayed, so check once on mount.
  useEffect(() => {
    try {
      const view = frame.current?.contentWindow;
      if (view && view.location.href !== "about:blank" && view.document.readyState === "complete") {
        box.current?.setAttribute("data-loaded", "true");
      }
    } catch {
      // The frame is same-origin; if it ever is not, the load event still fires.
    }
  }, []);

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
      className={cn("group/thumb relative w-full overflow-hidden bg-background [--thumb-scale:0.3]", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Shows, pulsing, until the frame paints its own background over it. */}
      <div className="absolute inset-0 animate-pulse bg-muted/60 group-data-[loaded=true]/thumb:animate-none motion-reduce:animate-none" />
      <iframe
        ref={frame}
        onLoad={markLoaded}
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
