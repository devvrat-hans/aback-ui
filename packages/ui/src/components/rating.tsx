"use client";

import * as React from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

import { cn } from "../lib/utils";

type RatingSize = "sm" | "default" | "lg";

const iconSize: Record<RatingSize, string> = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
};

function defaultItemLabel(value: number) {
  return `${value} ${value === 1 ? "star" : "stars"}`;
}

function Star({ fill, size }: { fill: number; size: RatingSize }) {
  // A partial fill clips the filled glyph over the outline, so read-only
  // averages such as 4.5 render without a second icon set.
  const percent = Math.round(Math.min(Math.max(fill, 0), 1) * 100);
  return (
    <span aria-hidden="true" className={cn("relative inline-flex shrink-0", iconSize[size])}>
      <IconStar className="size-full text-muted-foreground" />
      {percent > 0 ? (
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${percent}%` }}>
          <IconStarFilled className={cn("text-warning", iconSize[size])} />
        </span>
      ) : null}
    </span>
  );
}

export interface RatingProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "dir"> {
  /** Controlled value. 0 means no rating. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. */
  max?: number;
  /** Form field name. The checked radio submits its value with the form. */
  name?: string;
  /**
   * Display a value instead of collecting one. Accepts fractions such as 4.5
   * and renders a single image with a text alternative.
   */
  readOnly?: boolean;
  disabled?: boolean;
  /** Let a second press on the selected star clear the rating. */
  clearable?: boolean;
  size?: RatingSize;
  /** Accessible name for each option. Defaults to "3 stars". */
  getItemLabel?: (value: number, max: number) => string;
  /** Text alternative in read-only mode. Defaults to "Rated 4.5 out of 5". */
  getValueLabel?: (value: number, max: number) => string;
}

/**
 * A star rating. Interactive ratings are a native radio group, so arrow keys,
 * Tab, and form submission work without custom key handling. Name the group
 * with `aria-label` or `aria-labelledby`.
 */
function Rating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  name,
  readOnly = false,
  disabled = false,
  clearable = false,
  size = "default",
  getItemLabel = defaultItemLabel,
  getValueLabel = (value, total) => `Rated ${value} out of ${total}`,
  className,
  onMouseLeave,
  ...props
}: RatingProps) {
  const generatedName = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const value = valueProp ?? uncontrolled;
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  if (readOnly) {
    return (
      <div
        role="img"
        aria-label={getValueLabel(value, max)}
        data-slot="rating"
        data-readonly=""
        className={cn("inline-flex items-center gap-0.5", className)}
        {...props}
      >
        {stars.map((star) => (
          <Star key={star} fill={value - (star - 1)} size={size} />
        ))}
      </div>
    );
  }

  function commit(next: number) {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  }

  const shown = hovered ?? value;

  return (
    <div
      role="radiogroup"
      data-slot="rating"
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      className={cn("inline-flex items-center gap-0.5", disabled && "opacity-50", className)}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setHovered(null);
      }}
      {...props}
    >
      {stars.map((star) => (
        <label
          key={star}
          data-slot="rating-item"
          data-state={star <= value ? "on" : "off"}
          onMouseEnter={() => {
            if (!disabled) setHovered(star);
          }}
          className={cn(
            "relative inline-flex p-0.5 transition-transform duration-150",
            "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-focus-ring",
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110 motion-reduce:hover:scale-100",
          )}
        >
          <input
            type="radio"
            className="sr-only"
            name={name ?? generatedName}
            value={star}
            checked={value === star}
            disabled={disabled}
            onChange={() => commit(star)}
            onClick={() => {
              if (clearable && value === star) commit(0);
            }}
          />
          <Star fill={star <= shown ? 1 : 0} size={size} />
          <span className="sr-only">{getItemLabel(star, max)}</span>
        </label>
      ))}
    </div>
  );
}

export { Rating };
