"use client";

import { IconSettings } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardExample() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Workspace settings</CardTitle>
              <Badge variant="brand">Pro</Badge>
            </div>
            <CardDescription>Manage the name and address for this workspace.</CardDescription>
          </div>
          <IconSettings aria-hidden="true" className="mt-0.5 size-5 text-brand-icon" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="card-workspace">Workspace name</Label>
          <Input id="card-workspace" defaultValue="Aback Group" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="card-slug">Workspace URL</Label>
          <Input id="card-slug" defaultValue="aback-group" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t border-border pt-4">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
