"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

type ScrollbarVisibility = NonNullable<
  React.ComponentProps<typeof ScrollAreaPrimitive.Root>["type"]
>;

export interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  /** When the custom scrollbar is visible. Defaults to Radix's hover behavior. */
  scrollbarVisibility?: ScrollbarVisibility;
}

function ScrollArea({
  className,
  children,
  scrollbarVisibility = "hover",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={scrollbarVisibility}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        tabIndex={0}
        role={ariaLabel || ariaLabelledBy ? "region" : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="size-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex touch-none select-none border-l border-transparent p-px transition-colors"
      >
        <ScrollAreaPrimitive.Thumb
          data-slot="scroll-area-thumb"
          className="relative flex-1 bg-scrollbar-thumb hover:bg-scrollbar-thumb-hover"
        />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea };
