"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

export function ProgressExample() {
  const [value, setValue] = useState(18);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) => (current >= 100 ? 18 : current + 7));
    }, 900);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="border border-border p-4">
        <p className="text-sm font-medium text-foreground">Uploading brand-assets.zip</p>
        <p className="mb-3 text-xs text-muted-foreground">
          42 MB of 148 MB · {value >= 100 ? "Finishing up" : "Do not close this tab"}
        </p>
        <Progress value={value} label="Upload progress" showValue />
      </div>

      <div className="border border-border p-4">
        <p className="mb-3 text-sm font-medium text-foreground">Importing records</p>
        <Progress value={null} label="Import progress" />
        <p className="mt-2 text-xs text-muted-foreground">
          The total is not known until the file is parsed.
        </p>
      </div>
    </div>
  );
}
