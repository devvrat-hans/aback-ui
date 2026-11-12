"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { cn } from "../lib/utils";

/** Labelling attributes. Set them on Listbox and they reach the trigger, which is the control. */
interface ListboxControlProps {
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
}

const ListboxControlContext = React.createContext<ListboxControlProps>({});

export type ListboxProps = React.ComponentProps<typeof SelectPrimitive.Root> & ListboxControlProps;

/**
 * A styled single-select: a button that opens a list of options. Use it when
 * the options need icons, groups, or the product's own look. The native Select
 * is still the better choice for a long plain list, a phone-first form, or a
 * page that renders without JavaScript.
 */
function Listbox({
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: ListboxProps) {
  const control = React.useMemo(() => {
    const entries = Object.entries({
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
    }).filter(([, value]) => value !== undefined);
    return Object.fromEntries(entries) as ListboxControlProps;
  }, [id, ariaLabel, ariaLabelledBy, ariaDescribedBy, ariaInvalid, ariaRequired]);

  return (
    <ListboxControlContext.Provider value={control}>
      <SelectPrimitive.Root {...props} />
    </ListboxControlContext.Provider>
  );
}

function ListboxGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="listbox-group" {...props} />;
}

function ListboxValue({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="listbox-value"
      className={cn("truncate", className)}
      {...props}
    />
  );
}

const triggerSizes = {
  sm: "h-8",
  default: "h-9",
} as const;

export interface ListboxTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: keyof typeof triggerSizes;
}

function ListboxTrigger({ className, size = "default", children, ...props }: ListboxTriggerProps) {
  const control = React.useContext(ListboxControlContext);
  return (
    <SelectPrimitive.Trigger
      data-slot="listbox-trigger"
      data-size={size}
      {...control}
      className={cn(
        "group/listbox flex w-full min-w-0 items-center justify-between gap-2 border border-input bg-background px-3 text-left text-sm text-foreground shadow-xs",
        "outline-none transition-[color,background-color,border-color,box-shadow] duration-200",
        "hover:bg-muted/40",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "data-[placeholder]:text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        triggerSizes[size],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IconChevronDown
          aria-hidden="true"
          className="text-muted-foreground transition-transform duration-200 group-data-[state=open]/listbox:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function ListboxContent({
  className,
  children,
  position = "popper",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const popper = position === "popper";
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="listbox-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          popper &&
            "max-h-[min(var(--radix-select-content-available-height),22rem)] min-w-[var(--radix-select-trigger-width)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton
          data-slot="listbox-scroll-button"
          className="flex cursor-default items-center justify-center py-1 text-muted-foreground"
        >
          <IconChevronUp aria-hidden="true" className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton
          data-slot="listbox-scroll-button"
          className="flex cursor-default items-center justify-center py-1 text-muted-foreground"
        >
          <IconChevronDown aria-hidden="true" className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function ListboxLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="listbox-label"
      className={cn("px-3 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * One option. Its children are the option's text, and the same text shows in
 * the trigger once it is chosen. The chosen option carries a check mark, so
 * selection is not shown by colour alone.
 */
function ListboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="listbox-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center py-2 pl-3 pr-9 text-sm outline-none",
        "transition-colors duration-150 focus:bg-muted focus:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <IconCheck aria-hidden="true" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function ListboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="listbox-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Listbox,
  ListboxContent,
  ListboxGroup,
  ListboxItem,
  ListboxLabel,
  ListboxSeparator,
  ListboxTrigger,
  ListboxValue,
};
