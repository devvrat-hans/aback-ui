import * as React from "react";
import { Slot } from "radix-ui";
import { IconLoader2 } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
    "outline-none transition-[color,background-color,border-color,transform,opacity] duration-200",
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    // While loading the button stays focusable, so the busy state is announced
    // and focus is not dropped. The icon the button already had makes way for
    // the spinner, so the label does not shift.
    "aria-busy:cursor-progress aria-busy:opacity-70 aria-busy:active:scale-100",
    "data-[loading]:[&>svg:not([data-slot=button-spinner])]:hidden",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        brand:
          "bg-brand-fill text-on-brand-fill hover:bg-link-hover dark:hover:bg-primary-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background text-foreground shadow-xs hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-muted",
        link: "text-link underline-offset-4 hover:text-link-hover hover:underline",
      },
      size: {
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3",
        default: "h-9 px-4 has-[>svg]:px-3",
        lg: "h-10 px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * The action is running. Shows a spinner in place of the button's icon, sets
   * `aria-busy`, and ignores clicks until it is false again. The button stays
   * focusable, so a keyboard or screen reader user does not lose their place.
   */
  loading?: boolean;
  /** Replaces the label while loading, such as "Saving". Ignored with `asChild`. */
  loadingText?: React.ReactNode;
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  loadingText,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const spinner = loading ? (
    <IconLoader2 data-slot="button-spinner" aria-hidden="true" className="animate-spin" />
  ) : null;

  function ignoreClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Also stops a submit button from submitting its form a second time.
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
      onClick={loading ? ignoreClick : onClick}
    >
      {spinner}
      {asChild ? (
        // Slottable marks where the child's own content goes, so the spinner
        // can sit beside it inside the rendered element.
        <Slot.Slottable>{children}</Slot.Slottable>
      ) : loading && loadingText !== undefined ? (
        loadingText
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
