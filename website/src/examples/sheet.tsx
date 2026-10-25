"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Edit workspace</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Changes apply to every member of this workspace.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <Field htmlFor="sheet-workspace" label="Workspace name">
            <Input id="sheet-workspace" defaultValue="Aback Group" />
          </Field>
          <Field
            htmlFor="sheet-slug"
            label="URL slug"
            description="Lowercase letters, numbers, and dashes."
          >
            <Input id="sheet-slug" defaultValue="aback-group" />
          </Field>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
