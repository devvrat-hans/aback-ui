import { cn } from "@aback-ui/ui";

import { CopyButton } from "@/components/copy-button";

export function InstallCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border border-border bg-muted/20 p-1.5 pl-3",
        className,
      )}
    >
      <span aria-hidden="true" className="select-none font-mono text-xs text-muted-foreground">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
        {command}
      </code>
      <CopyButton value={command} label="Copy install command" />
    </div>
  );
}
