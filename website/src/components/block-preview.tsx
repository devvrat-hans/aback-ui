"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconCode,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconExternalLink,
  IconEye,
} from "@tabler/icons-react";

import { Tabs, TabsContent, TabsList, TabsTrigger, ToggleGroup, ToggleGroupItem } from "@aback-ui/ui";

import { FRAME_HEIGHT_MESSAGE } from "@/components/frame-bridge";

const viewports = {
  desktop: { label: "Desktop, 1280 pixels", width: 1280, icon: IconDeviceDesktop },
  tablet: { label: "Tablet, 768 pixels", width: 768, icon: IconDeviceTablet },
  mobile: { label: "Mobile, 375 pixels", width: 375, icon: IconDeviceMobile },
} as const;

type Viewport = keyof typeof viewports;

const MIN_HEIGHT = 280;
const MAX_HEIGHT = 900;

const trigger =
  "-mb-px h-10 gap-1.5 border-b-2 border-transparent px-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none";

/**
 * Renders a block in an iframe so its media queries, sticky elements, and
 * fixed banners behave as they would on a real page. Each width renders at
 * its true viewport and scales down to fit the column when it is narrower.
 */
export function BlockPreview({
  slug,
  title,
  code,
}: {
  slug: string;
  title: string;
  /** The block source, shown in the Code tab. */
  code?: React.ReactNode;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  // Set once the reader picks a width, so the narrow-screen default never overrides them.
  const chosen = useRef(false);
  const [height, setHeight] = useState(560);
  const [stageWidth, setStageWidth] = useState(0);
  const src = `/view/blocks/${slug}`;

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

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (width <= 0) return;
      setStageWidth(width);
      // On a phone, a 1280 pixel desktop shrinks to illegible; start at the phone width.
      if (!chosen.current && width < 640) setViewport("mobile");
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Every width renders at its true viewport and scales down only when the
  // column is narrower. Desktop grows to fill a column wider than 1280.
  const logical = viewports[viewport].width;
  const fills = viewport === "desktop" && stageWidth >= logical;
  const frameWidth = fills ? stageWidth : logical;
  const scale = stageWidth > 0 && stageWidth < frameWidth ? stageWidth / frameWidth : 1;
  const measured = stageWidth > 0;
  const name = viewports[viewport].label.split(",")[0];
  const caption =
    scale < 1
      ? `${name} at ${logical} pixels, shown at ${Math.round(scale * 100)}%.`
      : `${name} at ${Math.round(frameWidth)} pixels.`;

  return (
    <Tabs defaultValue="preview" className="gap-0">
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-b border-border">
        <TabsList aria-label={`${title} block`} className="h-10 gap-0 border-0 bg-transparent p-0">
          <TabsTrigger value="preview" className={trigger}>
            <IconEye aria-hidden="true" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className={trigger}>
            <IconCode aria-hidden="true" />
            Code
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2 pb-1.5">
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            aria-label="Preview width"
            value={viewport}
            onValueChange={(value) => {
              if (!(value in viewports)) return;
              chosen.current = true;
              setViewport(value as Viewport);
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

      <TabsContent value="preview" forceMount className="mt-4 data-[state=inactive]:hidden">
        <div className="border border-border bg-muted/30">
          <div ref={stage} className="relative overflow-x-auto">
            {/* Sits behind the frame and shows until the frame paints over it. */}
            <div aria-hidden="true" className="absolute inset-0 bg-muted/50" />
            <div
              className="relative mx-auto overflow-hidden"
              style={{ width: frameWidth * scale, height: height * scale, visibility: measured ? undefined : "hidden" }}
            >
              <iframe
                ref={frame}
                src={src}
                title={`${title} block preview`}
                className="block max-w-none origin-top-left border-0"
                style={{ width: frameWidth, height, transform: scale < 1 ? `scale(${scale})` : undefined }}
              />
            </div>
          </div>
          <p className="border-t border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            {caption} The frame scrolls when the block is taller than {MAX_HEIGHT} pixels. Example data is
            labelled inside the preview.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="code" className="mt-4">
        {code ?? <p className="text-sm text-muted-foreground">Block source is unavailable.</p>}
      </TabsContent>
    </Tabs>
  );
}
