"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

type AvatarSize = "xs" | "sm" | "default" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  default: "size-9 text-xs",
  lg: "size-11 text-sm",
  xl: "size-14 text-base",
};

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  size?: AvatarSize;
}

function Avatar({ className, size = "default", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden border border-border bg-muted",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface AvatarGroupProps extends React.ComponentProps<"div"> {
  /** Avatars shown before the rest collapse into a "+N" count. */
  max?: number;
  /** Total people the group stands for, when more exist than were rendered. */
  total?: number;
  /** Size of the overflow count. Match it to the avatars in the group. */
  size?: AvatarSize;
}

/**
 * Overlapping avatars for a team, reviewers, or recent participants. Extra
 * people collapse into a count with a text alternative. Name the group with
 * `aria-label` and keep each avatar's alt text, so the list is not only faces.
 */
function AvatarGroup({
  max,
  total,
  size = "default",
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = max === undefined ? items : items.slice(0, Math.max(0, max));
  const overflow = Math.max(0, (total ?? items.length) - visible.length);

  return (
    <div
      role="group"
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-2 [&>[data-slot=avatar]]:border-2 [&>[data-slot=avatar]]:border-background",
        className,
      )}
      {...props}
    >
      {visible}
      {overflow > 0 ? (
        <span
          data-slot="avatar-group-overflow"
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center border-2 border-background bg-secondary font-medium tabular-nums text-secondary-foreground",
            sizeClasses[size],
          )}
        >
          <span aria-hidden="true">+{overflow}</span>
          <span className="sr-only">and {overflow} more</span>
        </span>
      ) : null}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
