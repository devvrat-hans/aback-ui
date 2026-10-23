"use client";

import { Separator } from "@/components/ui/separator";

export function SeparatorExample() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-foreground">Workspace</p>
        <p className="text-sm text-muted-foreground">Aback Group</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium text-foreground">Plan</p>
        <p className="text-sm text-muted-foreground">Pro, billed annually</p>
      </div>
      <Separator />

      <div className="flex h-10 items-center gap-4 text-sm">
        <span>Overview</span>
        <Separator orientation="vertical" />
        <span>Members</span>
        <Separator orientation="vertical" />
        <span>Billing</span>
      </div>
    </div>
  );
}
