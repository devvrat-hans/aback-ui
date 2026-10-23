import * as React from "react";

import { cn } from "../lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center border border-border/60 bg-background px-1",
        "font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground",
        "shadow-[0_1px_0_0_rgb(0_0_0/0.04)] dark:shadow-[0_1px_0_0_rgb(255_255_255/0.04)]",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
