"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsExample() {
  return (
    <Tabs defaultValue="account" className="max-w-xl">
      <TabsList aria-label="Workspace settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">
          Billing
          <Badge variant="brand">Pro</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="flex flex-col gap-4">
        <Field htmlFor="tabs-name" label="Workspace name" description="Shown in the sidebar.">
          <Input id="tabs-name" defaultValue="Aback Group" />
        </Field>
        <div>
          <Button>Save changes</Button>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6 border border-border p-4">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="tabs-digest" className="font-normal">
              Weekly digest
            </Label>
            <p className="text-xs text-muted-foreground">A summary every Monday at 09:00.</p>
          </div>
          <Switch id="tabs-digest" defaultChecked />
        </div>
      </TabsContent>

      <TabsContent value="billing" className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Pro plan</p>
        <p className="text-sm text-muted-foreground">
          Billed annually. The next invoice is on 1 January 2027.
        </p>
        <div>
          <Button variant="outline">Manage billing</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
