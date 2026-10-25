"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CollapsibleExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-sm border border-border">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between px-4">
            Advanced options
            <IconChevronDown
              aria-hidden="true"
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-3 border-t border-border p-4">
            <Field
              htmlFor="collapsible-retries"
              label="Retry count"
              description="How many times a failed request is retried."
            >
              <Input id="collapsible-retries" type="number" defaultValue={3} min={0} max={10} />
            </Field>
            <Field
              htmlFor="collapsible-timeout"
              label="Timeout (ms)"
              description="Requests are cancelled after this duration."
            >
              <Input id="collapsible-timeout" type="number" defaultValue={5000} step={500} />
            </Field>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
