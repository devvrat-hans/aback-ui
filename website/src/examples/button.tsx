"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrowRight, IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

/** Runs a two second timer, so the loading state below shows real pending work. */
function useTwoSecondTask() {
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function run() {
    setRunning(true);
    timer.current = window.setTimeout(() => setRunning(false), 2000);
  }

  return [running, run] as const;
}

export function ButtonExample() {
  const [saving, save] = useTwoSecondTask();
  const [exporting, exportFile] = useTwoSecondTask();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Save changes</Button>
        <Button variant="brand">Publish</Button>
        <Button variant="outline">Download</Button>
        <Button variant="secondary">Duplicate</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">
          Read the docs
          <IconArrowRight aria-hidden="true" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add item">
          <IconPlus aria-hidden="true" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button loading={saving} loadingText="Saving" onClick={save}>
          Save for 2 seconds
        </Button>
        <Button variant="outline" loading={exporting} onClick={exportFile}>
          <IconDownload aria-hidden="true" />
          Export
        </Button>
        <span role="status" className="text-xs text-muted-foreground">
          {saving || exporting ? "Working. The button ignores further clicks." : "Each button waits two seconds."}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>
          Disabled outline
        </Button>
      </div>
    </div>
  );
}
