import { cn } from "@aback-ui/ui";

export function PreviewFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-border bg-background", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Live preview
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 bg-primary-500" />
          React
        </span>
      </div>
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}
