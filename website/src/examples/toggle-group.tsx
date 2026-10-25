"use client";

import { useState } from "react";
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from "@tabler/icons-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const alignments = [
  { value: "left", label: "Align left", icon: IconAlignLeft },
  { value: "center", label: "Align center", icon: IconAlignCenter },
  { value: "right", label: "Align right", icon: IconAlignRight },
] as const;

const alignmentClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function ToggleGroupExample() {
  const [alignment, setAlignment] = useState("left");

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Alignment</span>
        <ToggleGroup
          type="single"
          value={alignment}
          onValueChange={(value) => value && setAlignment(value)}
          aria-label="Text alignment"
        >
          {alignments.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value} aria-label={item.label}>
              <item.icon aria-hidden="true" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span className="font-mono text-xs text-muted-foreground">{alignment}</span>
      </div>

      <div className="border border-border bg-muted/20 p-4">
        <p className={`text-sm text-foreground ${alignmentClass[alignment] ?? "text-left"}`}>
          Text alignment is a view state. The value is announced through the group.
        </p>
      </div>
    </div>
  );
}
