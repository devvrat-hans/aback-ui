"use client";

import { Field, Input } from "@aback-ui/ui";

import { parseColor, rgbToHex } from "@/lib/color";

/**
 * A colour text field with a native colour picker beside it. The text is the
 * source of truth, so any CSS colour the parser accepts can be typed or
 * pasted; the picker writes HEX back into it.
 */
export function ColorField({
  id,
  label,
  value,
  onChange,
  description = "HEX, rgb(), hsl(), or oklch().",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}) {
  const parsed = parseColor(value);
  const invalid = value.trim() !== "" && parsed === null;
  const describedBy = `${id}-description${invalid ? ` ${id}-error` : ""}`;

  return (
    <Field
      htmlFor={id}
      label={label}
      description={description}
      error={invalid ? "Not a colour this tool can read. Try #009bf9 or oklch(65% 0.18 240)." : undefined}
    >
      <div className="flex gap-2">
        <label
          className="relative size-10 shrink-0 cursor-pointer border border-input focus-within:ring-2 focus-within:ring-focus-ring"
          style={{ backgroundColor: parsed ? rgbToHex(parsed) : "transparent" }}
        >
          <span className="sr-only">Pick {label.toLowerCase()} with the colour picker</span>
          <input
            type="color"
            value={parsed ? rgbToHex({ ...parsed, alpha: undefined }) : "#000000"}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className="font-mono"
        />
      </div>
    </Field>
  );
}
