"use client";

import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";

import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Field,
  Input,
  Label,
  Separator,
  Switch,
} from "@aback-ui/ui";

export function HomePreview() {
  const [digest, setDigest] = useState(true);
  const [security, setSecurity] = useState(true);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-3 -z-10 bg-brand-wash/70 dark:bg-brand-wash/40"
      />

      <div className="border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Live settings panel
          </span>
          <Badge variant="success">Stable</Badge>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                Workspace settings
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                A real composition of installed components.
              </p>
            </div>
            <Badge variant="brand">Pro</Badge>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <Field htmlFor="home-workspace" label="Workspace name">
              <Input id="home-workspace" defaultValue="Aback Group" />
            </Field>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="home-digest" className="font-normal">
                  Weekly digest
                </Label>
                <p className="text-xs text-muted-foreground">Sent every Monday at 09:00.</p>
              </div>
              <Switch
                id="home-digest"
                checked={digest}
                onCheckedChange={setDigest}
                aria-label="Weekly digest"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="home-security" className="font-normal">
                  Security alerts
                </Label>
                <p className="text-xs text-muted-foreground">Sign-ins and permission changes.</p>
              </div>
              <Switch
                id="home-security"
                checked={security}
                onCheckedChange={setSecurity}
                aria-label="Security alerts"
              />
            </div>

            <Alert variant="info">
              <IconInfoCircle aria-hidden="true" />
              <AlertDescription>
                Changes apply to every member of this workspace.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
