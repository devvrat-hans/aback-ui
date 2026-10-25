"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface SettingsValues {
  name: string;
  slug: string;
  weeklyDigest: boolean;
  deployAlerts: boolean;
}

export interface SettingsSectionBlockProps {
  initialValues?: Partial<SettingsValues>;
  onSave?: (values: SettingsValues) => void;
  onDelete?: () => void;
}

/**
 * A complete workspace settings section: identity, notification preferences,
 * a save bar, and a destructive zone that requires an explicit confirmation.
 * It is a section, not a page; put it inside your settings layout.
 */
export function SettingsSectionBlock({
  initialValues,
  onSave,
  onDelete,
}: SettingsSectionBlockProps) {
  const [values, setValues] = useState<SettingsValues>({
    name: initialValues?.name ?? "Aback Group",
    slug: initialValues?.slug ?? "aback-group",
    weeklyDigest: initialValues?.weeklyDigest ?? true,
    deployAlerts: initialValues?.deployAlerts ?? true,
  });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    onSave?.(values);
    setSaved(true);
  }

  return (
    <section aria-labelledby="workspace-settings-title" className="flex flex-col gap-6">
      <div>
        <h2
          id="workspace-settings-title"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Workspace settings
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These settings apply to every member of the workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle as="h3" className="text-base">
            General
          </CardTitle>
          <CardDescription>How the workspace appears to your team and in URLs.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field htmlFor="workspace-name" label="Workspace name" required>
              <Input
                id="workspace-name"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </Field>
            <Field
              htmlFor="workspace-slug"
              label="URL slug"
              description="Lowercase letters, numbers, and dashes."
            >
              <Input
                id="workspace-slug"
                value={values.slug}
                onChange={(event) => update("slug", event.target.value)}
              />
            </Field>
          </div>

          <div className="flex flex-col divide-y divide-border border-t border-border">
            <div className="flex items-start justify-between gap-4 py-3">
              <div>
                <Label htmlFor="workspace-digest">Weekly digest</Label>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  A Monday summary of deployments, invoices, and open reviews.
                </p>
              </div>
              <Switch
                id="workspace-digest"
                checked={values.weeklyDigest}
                onCheckedChange={(checked) => update("weeklyDigest", checked)}
              />
            </div>
            <div className="flex items-start justify-between gap-4 py-3">
              <div>
                <Label htmlFor="workspace-alerts">Deploy alerts</Label>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Notify the workspace when a production deploy finishes or fails.
                </p>
              </div>
              <Switch
                id="workspace-alerts"
                checked={values.deployAlerts}
                onCheckedChange={(checked) => update("deployAlerts", checked)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-3 border-t border-border pt-4">
          <p role="status" className="text-xs text-muted-foreground">
            {saved ? "Settings saved." : "Changes are local until you save."}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setValues({
                  name: initialValues?.name ?? "Aback Group",
                  slug: initialValues?.slug ?? "aback-group",
                  weeklyDigest: initialValues?.weeklyDigest ?? true,
                  deployAlerts: initialValues?.deployAlerts ?? true,
                });
                setSaved(false);
              }}
            >
              Reset
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="border-danger/40 dark:border-danger/40">
        <CardHeader>
          <CardTitle as="h3" className="text-base text-danger">
            Danger zone
          </CardTitle>
          <CardDescription>
            Deleting the workspace removes its members, projects, and deploy history. This cannot
            be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-danger/50 text-danger hover:bg-danger/5">
                Delete workspace
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {values.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Every member will lose access immediately, and the deploy history will be
                  removed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep workspace</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Delete workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </section>
  );
}
