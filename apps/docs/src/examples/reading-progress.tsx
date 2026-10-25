"use client";

import { useRef } from "react";

import { ReadingProgress } from "@/components/ui/reading-progress";

export function ReadingProgressExample() {
  const article = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full flex-col gap-3">
      <ReadingProgress target={article} />
      <p className="text-sm text-muted-foreground">
        Scroll this page. The bar at the very top of the window tracks the paragraph block below; it
        starts filling when the block reaches the top and is full when its end is in view.
      </p>
      <div ref={article} className="flex flex-col gap-3 border-l-2 border-primary-300 pl-4 dark:border-primary-600">
        {Array.from({ length: 6 }, (_, index) => (
          <p key={index} className="text-sm leading-relaxed text-muted-foreground">
            Paragraph {index + 1}. Long-form pages in Aback Tools and Aback Launch use this bar on
            guides and blog posts. It is decorative and hidden from assistive technology, because
            the scroll position is already available to everyone.
          </p>
        ))}
      </div>
    </div>
  );
}
