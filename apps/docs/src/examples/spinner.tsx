"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Spinner size="sm" label="Loading small" />
        <Spinner size="md" label="Loading default" />
        <Spinner size="lg" label="Loading large" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>
          <Spinner size="sm" label="Saving" className="text-primary-foreground" />
          Saving
        </Button>
        <Button variant="outline" disabled>
          <Spinner size="sm" label="Deploying" />
          Deploying
        </Button>
      </div>
    </div>
  );
}
