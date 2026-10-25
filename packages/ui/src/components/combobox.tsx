"use client";

import * as React from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

import { cn } from "../lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary line shown under the label in the list. */
  description?: string;
  disabled?: boolean;
  /** Extra words that should match the search without appearing as the label. */
  keywords?: string[];
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  /** Accessible name for the trigger when there is no visible `Label`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  id?: string;
  name?: string;
  className?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
}

/**
 * A single-select combobox: a button that opens a searchable list.
 *
 * Built from `Popover` and `Command`, so filtering, type-ahead, arrow keys,
 * Home/End, Enter, and Escape are real interactions rather than decoration.
 * The trigger keeps the current label, and the selected item is marked with a
 * check icon and `aria-selected` from the listbox.
 */
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  emptyMessage = "No matching options.",
  disabled,
  id,
  name,
  className,
  triggerClassName,
  align = "start",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;

  return (
    <div data-slot="combobox" className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? `${triggerId}-listbox` : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full items-center justify-between gap-2 border border-input bg-background px-3 text-left text-sm text-foreground shadow-xs",
              "outline-none transition-[color,background-color,border-color,box-shadow] duration-200",
              "hover:bg-muted/40",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
              triggerClassName,
            )}
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected?.label ?? placeholder}
            </span>
            <IconChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          aria-label={ariaLabel ?? "Choose an option"}
          className="w-[var(--radix-popover-trigger-width)] min-w-56 p-0"
        >
          <Command label={ariaLabel ?? "Options"}>
            <CommandInput placeholder={searchPlaceholder} autoFocus />
            <CommandList id={`${triggerId}-listbox`}>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label, ...(option.keywords ?? [])]}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                  className="items-start gap-2"
                >
                  <IconCheck
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate">{option.label}</span>
                    {option.description ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
    </div>
  );
}

export { Combobox };
