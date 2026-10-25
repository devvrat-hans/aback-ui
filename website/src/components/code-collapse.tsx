"use client";

import { useId, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { Button } from "@aback-ui/ui";

/** Caps a long code sample at a readable height until the reader expands it. */
export function CodeCollapse({ lines, children }: { lines: number; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();

  return (
    <div className="relative">
      <div id={id} className={expanded ? undefined : "max-h-80 overflow-hidden"}>
        {children}
      </div>
      <div
        className={
          expanded
            ? "flex justify-center border-t border-border bg-code py-2"
            : "absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-code via-code/90 to-transparent pb-3 pt-16"
        }
      >
        <Button
          variant="outline"
          size="sm"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? <IconChevronUp aria-hidden="true" /> : <IconChevronDown aria-hidden="true" />}
          {expanded ? "Collapse code" : `Expand all ${lines} lines`}
        </Button>
      </div>
    </div>
  );
}
