"use client";

import { IconFolder } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function EmptyStateExample() {
  return (
    <EmptyState
      className="max-w-2xl"
      icon={<IconFolder aria-hidden="true" />}
      title="No projects yet"
      description="Create a project to start building. Every project gets its own components, tokens, and registry output."
      action={<Button>Create project</Button>}
    />
  );
}
