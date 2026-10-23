"use client";

import { IconArrowRight, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Save changes</Button>
        <Button variant="brand">Publish</Button>
        <Button variant="outline">Download</Button>
        <Button variant="secondary">Duplicate</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">
          Read the docs
          <IconArrowRight aria-hidden="true" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add item">
          <IconPlus aria-hidden="true" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>
          Disabled outline
        </Button>
      </div>
    </div>
  );
}
