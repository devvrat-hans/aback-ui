"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LabelExample() {
  return (
    <div className="flex max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="example-project">Project name</Label>
        <Input id="example-project" placeholder="Aback UI" />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="example-terms" />
        <Label htmlFor="example-terms" className="font-normal">
          I agree to the terms of service
        </Label>
      </div>
    </div>
  );
}
