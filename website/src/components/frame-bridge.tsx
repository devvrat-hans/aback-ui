"use client";

import { useEffect } from "react";

import { useTheme } from "@aback-ui/ui";

export const FRAME_HEIGHT_MESSAGE = "aback-ui:frame-height";

/**
 * Runs inside a block preview frame. It keeps the frame's theme in step with
 * the documentation page (useTheme listens for the shared storage key) and
 * reports the content height to the parent, same origin only.
 */
export function FrameBridge({ rootId }: { rootId: string }) {
  useTheme();

  useEffect(() => {
    if (window.parent === window) return;
    const root = document.getElementById(rootId);
    if (!root) return;

    function report() {
      window.parent.postMessage(
        { type: FRAME_HEIGHT_MESSAGE, height: root?.offsetHeight ?? 0 },
        window.location.origin,
      );
    }

    const observer = new ResizeObserver(report);
    observer.observe(root);
    report();
    return () => observer.disconnect();
  }, [rootId]);

  return null;
}
