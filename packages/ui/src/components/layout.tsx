import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

// Literal class names, so Tailwind can find every one of them in the source.
const gapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

export type LayoutGap = keyof typeof gapClasses;

interface LayoutProps extends React.ComponentProps<"div"> {
  /** Render the child element instead of a div, such as a `<main>` or `<section>`. */
  asChild?: boolean;
}

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
} as const;

export interface ContainerProps extends LayoutProps {
  size?: keyof typeof containerSizes;
}

/** A centred page column with the standard gutter: 16px on phones, 24px from md. */
function Container({ size = "lg", asChild = false, className, ...props }: ContainerProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="container"
      className={cn("mx-auto w-full px-4 md:px-6", containerSizes[size], className)}
      {...props}
    />
  );
}

export interface StackProps extends LayoutProps {
  gap?: LayoutGap;
}

/** A vertical flow with one gap between children. */
function Stack({ gap = "md", asChild = false, className, ...props }: StackProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="stack"
      className={cn("flex flex-col", gapClasses[gap], className)}
      {...props}
    />
  );
}

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export interface GroupProps extends LayoutProps {
  gap?: LayoutGap;
  align?: keyof typeof alignClasses;
  justify?: keyof typeof justifyClasses;
  /** Wrap onto new lines on narrow screens. On by default, so rows never overflow. */
  wrap?: boolean;
}

/** A horizontal row for toolbars and action groups. */
function Group({
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = true,
  asChild = false,
  className,
  ...props
}: GroupProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="group"
      className={cn(
        "flex flex-row",
        wrap && "flex-wrap",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
      {...props}
    />
  );
}

const gridColumns = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
} as const;

export interface GridProps extends LayoutProps {
  /** Columns at the widest breakpoint. Narrower screens step down to one or two. */
  columns?: keyof typeof gridColumns;
  gap?: LayoutGap;
}

/** A responsive card grid that starts at one column on phones. */
function Grid({ columns = 3, gap = "md", asChild = false, className, ...props }: GridProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="grid"
      className={cn("grid", gridColumns[columns], gapClasses[gap], className)}
      {...props}
    />
  );
}

export { Container, Grid, Group, Stack };
