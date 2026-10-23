import { cn } from "@aback-ui/ui";

import { CopyButton } from "@/components/copy-button";

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden border border-border bg-muted/30", className)}>
      <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          {filename ? (
            <span className="truncate font-mono text-xs text-foreground">{filename}</span>
          ) : null}
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">
            {language}
          </span>
        </div>
        <CopyButton value={code} label="Copy code" />
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={filename ? `${filename} code` : "Code example"}
        className="overflow-x-auto p-4 text-[13px] leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
      >
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}
