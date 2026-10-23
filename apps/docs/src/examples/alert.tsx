"use client";

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconShieldX,
} from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertExample() {
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert variant="info">
        <IconInfoCircle aria-hidden="true" />
        <div>
          <AlertTitle>Registry update available</AlertTitle>
          <AlertDescription>Version 0.2 adds three components and a revised focus ring.</AlertDescription>
        </div>
      </Alert>

      <Alert variant="success" role="status">
        <IconCircleCheck aria-hidden="true" />
        <div>
          <AlertTitle>Deployment complete</AlertTitle>
          <AlertDescription>abackui.com is serving the latest build.</AlertDescription>
        </div>
      </Alert>

      <Alert variant="warning">
        <IconAlertTriangle aria-hidden="true" />
        <div>
          <AlertTitle>Usage limit approaching</AlertTitle>
          <AlertDescription>You have used 82% of this month's build minutes.</AlertDescription>
        </div>
      </Alert>

      <Alert variant="destructive" role="alert">
        <IconShieldX aria-hidden="true" />
        <div>
          <AlertTitle>Domain verification failed</AlertTitle>
          <AlertDescription>Add the TXT record below, then run verification again.</AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
