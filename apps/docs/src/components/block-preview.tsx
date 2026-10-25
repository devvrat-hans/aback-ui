"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconExternalLink,
} from "@tabler/icons-react";

import { ToggleGroup, ToggleGroupItem } from "@aback-ui/ui";

import { FRAME_HEIGHT_MESSAGE } from "@/components/frame-bridge";

const viewports = {
  desktop: { label: "Desktop", width: undefined, icon: IconDeviceDesktop },
  tablet: { label: "Tablet, 768 pixels", width: 768, icon: IconDeviceTablet },
  mobile: { label: "Mobile, 375 pixels", width: 375, icon: IconDeviceMobile },
} as const;

type Viewport = keyof typeof viewports;

const MIN_HEIGHT = 260;
const MAX_HEIGHT = 760;

/**
 * Renders a block in an iframe so its media queries, sticky elements, and
 * fixed banners behave as they would on a real page, at three widths.
 */
export function BlockPreview({ slug, title }: { slug: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [height, setHeight] = useState(520);
  const [loaded, setLoaded] = useState(false);
  const src = `/view/blocks/${slug}`;
  const width = viewports[viewport].width;

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data as { type?: unknown; height?: unknown } | null;
      if (data?.type !== FRAME_HEIGHT_MESSAGE || typeof data.height !== "number") return;
      setHeight(Math.min(Math.max(Math.ceil(data.height), MIN_HEIGHT), MAX_HEIGHT));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Live preview
        </span>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            aria-label="Preview width"
            value={viewport}
            onValueChange={(value) => {
              if (value in viewports) setViewport(value as Viewport);
            }}
          >
            {(Object.keys(viewports) as Viewport[]).map((key) => {
              const Icon = viewports[key].icon;
              return (
                <ToggleGroupItem key={key} value={key} aria-label={viewports[key].label} title={viewports[key].label}>
                  <Icon aria-hidden="true" />
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          <a
            href={src}
            target="_blank"
            rel="noopener"
            className="inline-flex h-8 items-center gap-1.5 border border-input px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <IconExternalLink aria-hidden="true" className="size-3.5" />
            <span className="hidden sm:inline">Open</span>
            <span className="sr-only"> the {title} preview in a new tab</span>
          </a>
        </div>
      </div>
      <div className="relative overflow-x-auto bg-muted/30">
        {!loaded ? (
          <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-muted/40 motion-reduce:animate-none" />
        ) : null}
        <iframe
          ref={frame}
          src={src}
          title={`${title} block preview`}
          onLoad={() => setLoaded(true)}
          className="mx-auto block max-w-none bg-background transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: width ? `${width}px` : "100%", height }}
        />
      </div>
      <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        {width ? `${width} px wide.` : "Full width."} The frame scrolls when the block is taller than{" "}
        {MAX_HEIGHT} px. Example data is labelled inside the preview.
      </p>
    </div>
  );
}
