"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Accessible name for the thumb. Required unless aria-labelledby is used. */
  label?: string;
}

function Slider({
  className,
  label,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[orientation=vertical]:h-44 data-[orientation=vertical]:w-4 data-[orientation=vertical]:flex-col",
        "data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden bg-secondary",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        aria-label={label}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          "block size-4 shrink-0 border-2 border-background bg-primary shadow-sm",
          "outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none",
        )}
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
