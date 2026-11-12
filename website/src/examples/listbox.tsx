"use client";

import { useState } from "react";
import { IconLock, IconUsers, IconWorld } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Listbox,
  ListboxContent,
  ListboxGroup,
  ListboxItem,
  ListboxLabel,
  ListboxSeparator,
  ListboxTrigger,
  ListboxValue,
} from "@/components/ui/listbox";

export function ListboxExample() {
  const [region, setRegion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Field label="Visibility" description="Who can open this report.">
        <Listbox defaultValue="team">
          <ListboxTrigger>
            <ListboxValue />
          </ListboxTrigger>
          <ListboxContent>
            <ListboxItem value="public">
              <span className="flex items-center gap-2">
                <IconWorld aria-hidden="true" />
                Anyone with the link
              </span>
            </ListboxItem>
            <ListboxItem value="team">
              <span className="flex items-center gap-2">
                <IconUsers aria-hidden="true" />
                Your team
              </span>
            </ListboxItem>
            <ListboxItem value="private">
              <span className="flex items-center gap-2">
                <IconLock aria-hidden="true" />
                Only you
              </span>
            </ListboxItem>
          </ListboxContent>
        </Listbox>
      </Field>

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field
          label="Data region"
          required
          error={submitted && !region ? "Choose a region before you continue." : undefined}
        >
          <Listbox name="region" value={region} onValueChange={setRegion}>
            <ListboxTrigger>
              <ListboxValue placeholder="Choose a region" />
            </ListboxTrigger>
            <ListboxContent>
              <ListboxGroup>
                <ListboxLabel>Americas</ListboxLabel>
                <ListboxItem value="us-east">US East</ListboxItem>
                <ListboxItem value="us-west">US West</ListboxItem>
              </ListboxGroup>
              <ListboxSeparator />
              <ListboxGroup>
                <ListboxLabel>Europe</ListboxLabel>
                <ListboxItem value="eu-central">Frankfurt</ListboxItem>
                <ListboxItem value="eu-west">Dublin</ListboxItem>
                <ListboxItem value="eu-north" disabled>
                  Stockholm (not available yet)
                </ListboxItem>
              </ListboxGroup>
            </ListboxContent>
          </Listbox>
        </Field>
        <Button type="submit" variant="outline" className="self-start">
          Check the field
        </Button>
        <p role="status" className="text-xs text-muted-foreground">
          {submitted && region ? `Submitted region: ${region}` : "Submitting without a choice shows the error state."}
        </p>
      </form>

      <Listbox aria-label="Rows per page" defaultValue="25">
        <ListboxTrigger size="sm" className="w-32">
          <ListboxValue />
        </ListboxTrigger>
        <ListboxContent>
          <ListboxItem value="10">10 rows</ListboxItem>
          <ListboxItem value="25">25 rows</ListboxItem>
          <ListboxItem value="50">50 rows</ListboxItem>
        </ListboxContent>
      </Listbox>
    </div>
  );
}
