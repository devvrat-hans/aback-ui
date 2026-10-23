"use client";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function BreadcrumbsExample() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Components", href: "/docs/components" },
          { label: "Breadcrumbs" },
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Workspace", href: "/docs" },
          { label: "Settings" },
        ]}
      />
    </div>
  );
}
