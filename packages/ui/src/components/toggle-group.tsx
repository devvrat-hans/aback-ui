"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const toggleGroupItemVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap",
    "outline-none transition-colors duration-150",
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent text-foreground hover:bg-muted",
        outline:
          "border border-input bg-background text-foreground hover:bg-muted data-[state=on]:border-primary",
      },
      size: {
        sm: "h-8 min-w-8 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 min-w-9 px-3 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 min-w-10 px-4 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupItemVariants>;

// Root is a single/multiple discriminated union; the wrapper keeps the same
// contract and forwards `type` untouched.
const ToggleGroupRoot = ToggleGroupPrimitive.Root as React.ComponentType<ToggleGroupProps>;

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupRoot
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex w-fit divide-x divide-border border border-border bg-background",
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants };
