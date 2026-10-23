import * as React from "react";
import { IconInbox } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 border border-border bg-muted/10 p-12 text-center",
        className,
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center text-muted-foreground/40 [&_svg]:size-8">
        {icon ?? <IconInbox aria-hidden="true" />}
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
