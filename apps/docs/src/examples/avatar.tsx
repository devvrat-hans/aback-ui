import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const members = [
  { name: "Aditi Rao", role: "Design", initials: "AR", image: undefined },
  { name: "Bilal Khan", role: "Engineering", initials: "BK", image: undefined },
  {
    name: "Chen Wei",
    role: "Product",
    initials: "CW",
    image: undefined,
  },
];

export function AvatarExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex w-full flex-col divide-y divide-border border border-border">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-3 px-4 py-3">
            <Avatar>
              {member.image ? <AvatarImage src={member.image} alt={member.name} /> : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            <Badge variant="outline">{member.initials}</Badge>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <AvatarGroup aria-label="Reviewers" max={3} total={8} size="sm">
          {["AR", "BK", "CW", "DM"].map((initials) => (
            <Avatar key={initials} size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <span className="text-xs text-muted-foreground">8 reviewers on this release</span>
      </div>
    </div>
  );
}
