import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const itemVariants = cva(
  [
    "group/item flex min-w-0 text-left outline-none",
    // Only a link or a button gets hover and focus treatment, so a static row
    // never looks clickable.
    "[&:is(a,button)]:transition-colors [&:is(a,button)]:duration-200",
    "[&:is(a,button)]:focus-visible:ring-2 [&:is(a,button)]:focus-visible:ring-focus-ring",
    "[&:is(a,button)]:focus-visible:ring-offset-2 [&:is(a,button)]:focus-visible:ring-offset-background",
  ],
  {
    variants: {
      variant: {
        default: "[&:is(a,button)]:hover:bg-muted/50",
        outline: [
          "border border-border bg-card",
          "[&:is(a,button)]:hover:border-primary-300 [&:is(a,button)]:hover:bg-muted/50",
          "dark:[&:is(a,button)]:hover:border-primary-700",
        ],
        muted: "border border-border bg-muted/30 [&:is(a,button)]:hover:bg-muted/60",
      },
      size: {
        sm: "gap-2.5",
        default: "gap-3",
      },
      align: {
        start: "items-start",
        center: "items-center",
      },
    },
    compoundVariants: [
      { variant: "outline", size: "default", className: "p-4" },
      { variant: "outline", size: "sm", className: "p-3" },
      { variant: "muted", size: "default", className: "p-4" },
      { variant: "muted", size: "sm", className: "p-3" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      align: "start",
    },
  },
);

export interface ItemProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof itemVariants> {
  /** Render the child instead of a div: a link, a button, or a list item. */
  asChild?: boolean;
}

/**
 * A row of media, text, and actions: a feature in a list, a link card, a file
 * in a queue, a setting. Compose it from ItemMedia, ItemContent, ItemTitle,
 * ItemDescription, and ItemActions.
 */
function Item({
  variant = "default",
  size = "default",
  align = "start",
  asChild = false,
  className,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, align }), className)}
      {...props}
    />
  );
}

const itemMediaVariants = cva("flex shrink-0 items-center justify-center", {
  variants: {
    variant: {
      /** The 40px brand chip with a 20px icon. */
      chip: "size-10 bg-brand-chip text-brand-icon [&_svg:not([class*='size-'])]:size-5",
      /** A bare brand-coloured icon, one text line tall so it sits on the title. */
      icon: "h-6 text-brand-icon [&_svg:not([class*='size-'])]:size-5",
      /** A square thumbnail, logo, or avatar. */
      image: "size-10 overflow-hidden bg-muted [&_img]:size-full [&_img]:object-cover",
    },
  },
  defaultVariants: {
    variant: "chip",
  },
});

export interface ItemMediaProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof itemMediaVariants> {}

/**
 * The leading visual. An icon here is decoration next to the title, so give it
 * `aria-hidden`. An image that carries meaning keeps its `alt` text.
 */
function ItemMedia({ variant = "chip", className, ...props }: ItemMediaProps) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}

export interface ItemTitleProps extends React.ComponentProps<"div"> {
  /** The element to render. Use a heading when the item introduces a section of the page. */
  as?: "div" | "p" | "span" | "h2" | "h3" | "h4" | "h5";
}

function ItemTitle({ as: Comp = "div", className, ...props }: ItemTitleProps) {
  return (
    <Comp
      data-slot="item-title"
      className={cn(
        "text-sm font-medium leading-6 text-foreground",
        // Inside a link or button the title picks up the link colour on hover.
        "group-[:is(a,button)]/item:transition-colors group-[:is(a,button)]/item:duration-200",
        "group-[:is(a,button):hover]/item:text-link",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Trailing controls or a chevron. Stays on the first line next to the title. */
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn(
        "flex shrink-0 items-center gap-2 self-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  itemMediaVariants,
  itemVariants,
};
