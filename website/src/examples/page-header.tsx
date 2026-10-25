"use client";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";

export function PageHeaderExample() {
  return (
    <div className="flex flex-col gap-3">
      {/* This preview sits under the documentation page's h1, so the demo
          header is an h2. App pages use the default h1. */}
      <PageHeader
        as="h2"
        eyebrow="Workspace"
        title="API keys"
        description="Create and revoke keys for the Aback API. Keys are shown once, so store them securely."
        actions={
          <>
            <Button>
              <IconPlus aria-hidden="true" />
              Create key
            </Button>
            <Button variant="outline">Read the docs</Button>
          </>
        }
      />
      <Breadcrumbs
        items={[
          { label: "Workspace", href: "/docs" },
          { label: "Settings", href: "/docs" },
          { label: "API keys" },
        ]}
      />
    </div>
  );
}
