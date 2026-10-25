import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function HoverCardExample() {
  return (
    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
      Assigned to{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="font-medium text-link underline underline-offset-4"
          >
            @aditi
          </button>
        </HoverCardTrigger>
        <HoverCardContent align="start" aria-label="Aditi Rao profile">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Aditi Rao</p>
              <p className="text-xs text-muted-foreground">Design lead · Joined 2024</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Owns the Aback design language and the component review queue.
              </p>
              <Badge variant="outline" className="mt-2">
                Design
              </Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      on the billing migration.
    </p>
  );
}
