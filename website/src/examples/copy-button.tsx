"use client";

import { CopyButton } from "@/components/ui/copy-button";

const token = "abk_test_4f9c2e1a7b";

export function CopyButtonExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex items-center gap-2 border border-border bg-muted/20 p-1.5 pl-3">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
          npm install @aback-ui/ui
        </code>
        <CopyButton value="npm install @aback-ui/ui" label="Copy install command" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Test API key</span>
        <div className="flex items-center gap-2">
          <code className="flex h-9 min-w-0 flex-1 items-center border border-input px-3 font-mono text-xs">
            {token}
          </code>
          <CopyButton value={token} variant="outline" size="default" showLabel label="Copy key" />
        </div>
        <span className="text-xs text-muted-foreground">Example value. It is not a real credential.</span>
      </div>

      <CopyButton value="" showLabel label="Nothing to copy" variant="outline" />
    </div>
  );
}
