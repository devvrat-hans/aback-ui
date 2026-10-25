"use client";

import { useState } from "react";
import { IconFilter } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const owners = ["Aditi Rao", "Bilal Khan", "Chen Wei"];

export function PopoverExample() {
  const [selected, setSelected] = useState<string[]>(["Aditi Rao"]);

  function toggle(owner: string) {
    setSelected((current) =>
      current.includes(owner)
        ? current.filter((item) => item !== owner)
        : [...current, owner],
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <IconFilter aria-hidden="true" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label="Filter by owner">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Owner</p>
              <p className="text-xs text-muted-foreground">Show work assigned to these people.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {owners.map((owner) => {
                const id = `owner-${owner.replace(/\s+/g, "-").toLowerCase()}`;
                return (
                  <div key={owner} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={selected.includes(owner)}
                      onCheckedChange={() => toggle(owner)}
                    />
                    <Label htmlFor={id} className="font-normal">
                      {owner}
                    </Label>
                  </div>
                );
              })}
            </div>
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
              {selected.length} of {owners.length} owners selected
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-sm text-muted-foreground">
        {selected.length === 0 ? "No owner filter" : selected.join(", ")}
      </span>
    </div>
  );
}
