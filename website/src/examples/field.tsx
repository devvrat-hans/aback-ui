"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { CopyButton } from "@/components/ui/copy-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function FieldExample() {
  const [domain, setDomain] = useState("abacktools.com");
  const taken = domain.trim().toLowerCase() === "abacktools.com";

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Field label="Workspace name" description="Visible to everyone on your team." required>
        <Input placeholder="Aback Group" required />
      </Field>

      <Field label="Data region" description="Choose where new records are stored.">
        <Select defaultValue="eu">
          <option value="us">United States</option>
          <option value="eu">European Union</option>
          <option value="ap">Asia Pacific</option>
        </Select>
      </Field>

      <Field
        label="Custom domain"
        description="Try another value to clear the error."
        error={taken ? "This domain is already connected to another workspace." : undefined}
      >
        <Input value={domain} onChange={(event) => setDomain(event.target.value)} />
      </Field>

      <Field label="Monthly budget" description="Before tax.">
        {(control) => (
          <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <InputGroupInput inputMode="decimal" defaultValue="1,200" {...control} />
            <InputGroupAddon align="end">per month</InputGroupAddon>
          </InputGroup>
        )}
      </Field>

      <Field
        label="Embed code"
        action={<CopyButton value={'<script src="https://example.com/widget.js"></script>'} label="Copy embed code" />}
      >
        <Textarea
          readOnly
          rows={2}
          className="min-h-0 font-mono text-xs"
          defaultValue={'<script src="https://example.com/widget.js"></script>'}
        />
      </Field>

      <div className="flex flex-col gap-4 border border-border p-4">
        <Field
          orientation="horizontal"
          label="First row is a header"
          description="Use the first line of the file for column names."
        >
          <Switch defaultChecked />
        </Field>
        <Field orientation="horizontal" label="Email me when the export is ready">
          <Checkbox />
        </Field>
      </div>
    </div>
  );
}
