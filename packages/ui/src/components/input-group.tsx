import * as React from "react";

import { cn } from "../lib/utils";
import { Input } from "./input";

const CONTROL_SELECTOR = "[data-slot='input-group-control']";

/**
 * A 36px input frame that joins a control with prefixes and suffixes: units,
 * currency, a search icon, or a small button. The frame owns the border and
 * the focus ring, so the affixes and the field read as one control.
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "flex h-9 w-full min-w-0 items-stretch border border-input bg-transparent shadow-xs dark:bg-input/30",
        "transition-[border-color,box-shadow] duration-200",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-focus-ring",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2 has-[[data-slot=input-group-control]:focus-visible]:ring-offset-background",
        "has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive",
        "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/** The text control inside an InputGroup. Accepts every native input prop. */
const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function InputGroupInput({ className, ...props }, ref) {
    return (
      <Input
        ref={ref}
        data-slot="input-group-control"
        className={cn(
          "h-full min-w-0 flex-1 border-0 bg-transparent shadow-none",
          "focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent",
          className,
        )}
        {...props}
      />
    );
  },
);
InputGroupInput.displayName = "InputGroupInput";

export interface InputGroupAddonProps extends React.ComponentProps<"div"> {
  /** Which side of the control the addon sits on. Sets the dividing border. */
  align?: "start" | "end";
  /**
   * `text` is a boxed segment for units and prefixes ("$", "%", "https://").
   * `inline` sits inside the field for an icon or a compact button.
   */
  variant?: "text" | "inline";
}

/**
 * A prefix or suffix. Clicking a non-interactive addon focuses the control,
 * the way a native label would. Give the addon an id and add it to the
 * control's `aria-describedby` when it carries meaning, such as a unit.
 */
function InputGroupAddon({
  align = "start",
  variant = "text",
  className,
  onMouseDown,
  ...props
}: InputGroupAddonProps) {
  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    onMouseDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea")) return;
    const control = event.currentTarget.parentElement?.querySelector<HTMLElement>(CONTROL_SELECTOR);
    if (!control) return;
    event.preventDefault();
    control.focus();
  }

  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      data-variant={variant}
      onMouseDown={handleMouseDown}
      className={cn(
        "flex shrink-0 select-none items-center whitespace-nowrap text-sm text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === "text" && "border-input bg-muted/40 px-3",
        variant === "text" && (align === "start" ? "border-r" : "border-l"),
        variant === "inline" && (align === "start" ? "pl-3" : "gap-1 pr-2"),
        align === "end" && "order-last",
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
