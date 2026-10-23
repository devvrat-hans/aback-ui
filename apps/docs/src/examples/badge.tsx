"use client";

import { IconCheck, IconClock, IconAlertTriangle } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";

export function BadgeExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="muted">Muted</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">
          <IconCheck aria-hidden="true" />
          Deployed
        </Badge>
        <Badge variant="warning">
          <IconClock aria-hidden="true" />
          Pending review
        </Badge>
        <Badge variant="destructive">
          <IconAlertTriangle aria-hidden="true" />
          Action required
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-[11px] font-normal">
          registry:ui
        </Badge>
        <Badge variant="outline" className="font-mono text-[11px] font-normal">
          v0.1.0
        </Badge>
      </div>
    </div>
  );
}
