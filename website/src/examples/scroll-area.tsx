import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const deployments = [
  { id: "dpl_8f2", status: "success", note: "Production · main@4f2c1a9", time: "2m ago" },
  { id: "dpl_8f1", status: "success", note: "Preview · feat/blocks@91ba20c", time: "18m ago" },
  { id: "dpl_8f0", status: "failed", note: "Production · main@0c7dd13", time: "1h ago" },
  { id: "dpl_8ef", status: "success", note: "Preview · fix/command@aa12b04", time: "3h ago" },
  { id: "dpl_8ee", status: "success", note: "Preview · docs/cli@72e91bd", time: "5h ago" },
  { id: "dpl_8ed", status: "cancelled", note: "Preview · wip/theme@ca0f2e1", time: "yesterday" },
  { id: "dpl_8ec", status: "success", note: "Production · main@b7e40aa", time: "yesterday" },
  { id: "dpl_8eb", status: "success", note: "Preview · feat/avatar@1d9c3fe", time: "2d ago" },
];

const variant = {
  success: "success",
  failed: "destructive",
  cancelled: "outline",
} as const;

export function ScrollAreaExample() {
  return (
    <div className="w-full max-w-md border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-sm font-medium text-foreground">Deployments</p>
        <span className="text-xs tabular-nums text-muted-foreground">
          {deployments.length} total
        </span>
      </div>
      <ScrollArea aria-label="Deployment history" className="h-56">
        <ul className="divide-y divide-border">
          {deployments.map((deployment) => (
            <li key={deployment.id} className="flex items-start justify-between gap-3 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-foreground">{deployment.id}</p>
                <p className="truncate text-xs text-muted-foreground">{deployment.note}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant={variant[deployment.status as keyof typeof variant]}>
                  {deployment.status}
                </Badge>
                <span className="text-[11px] text-muted-foreground">{deployment.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
