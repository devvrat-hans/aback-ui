"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface ReadingProgressProps extends Omit<React.ComponentProps<"div">, "children"> {
  /**
   * The element whose length is being read, such as the article. Without it,
   * progress follows the whole document.
   */
  target?: React.RefObject<HTMLElement | null>;
}

function measure(target?: HTMLElement | null) {
  if (!target) {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    return scrollable > 0 ? root.scrollTop / scrollable : 0;
  }
  const rect = target.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  if (scrollable <= 0) return rect.top <= 0 ? 1 : 0;
  return -rect.top / scrollable;
}

/**
 * A thin bar along the top of the viewport that fills as the reader scrolls.
 * It is decorative and hidden from assistive technology. Updates run once per
 * frame and write a transform directly, so scrolling never re-renders React.
 */
function ReadingProgress({ target, className, ...props }: ReadingProgressProps) {
  const bar = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let frame = 0;
    let pending = false;
    function update() {
      const progress = Math.min(Math.max(measure(target?.current), 0), 1);
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    }
    function schedule() {
      if (pending) return;
      pending = true;
      frame = window.requestAnimationFrame(() => {
        pending = false;
        update();
      });
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (pending) window.cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div
      aria-hidden="true"
      data-slot="reading-progress"
      className={cn("pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] print:hidden", className)}
      {...props}
    >
      <div
        ref={bar}
        data-slot="reading-progress-bar"
        className="h-full origin-left bg-linear-to-r from-primary-400 to-primary-600"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export { ReadingProgress };
