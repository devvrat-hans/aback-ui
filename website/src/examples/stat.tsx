import { IconRocket, IconUsers, IconWorld } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Stat, StatGrid } from "@/components/ui/stat";

export function StatExample() {
  return (
    <div className="flex w-full flex-col gap-6">
      <StatGrid columns={3}>
        <Stat
          label="Launches this week"
          value="32"
          icon={<IconRocket />}
          trend={{ direction: "up", label: "+8 vs last week" }}
        />
        <Stat
          label="Founders joined"
          value="802"
          icon={<IconUsers />}
          trend={{ direction: "flat", label: "Same as last week" }}
        />
        <Stat
          label="Page views"
          value="961"
          hint="Last 30 days"
          icon={<IconWorld />}
          trend={{ direction: "down", label: "-4% vs previous 30 days" }}
        />
      </StatGrid>

      <StatGrid columns={4} joined>
        <Stat label="Original" value="2.4" unit="MB" size="sm" />
        <Stat label="Compressed" value="612" unit="KB" size="sm" tone="success" />
        <Stat label="Saved" value="75%" size="sm" tone="success" />
        <Stat label="Time" value="0.8" unit="s" size="sm" />
      </StatGrid>

      <Stat
        className="max-w-xs"
        label="Domain rating"
        badge={<Badge variant="info">Example</Badge>}
        value="43"
        size="lg"
        tone="info"
        emphasis
      />
    </div>
  );
}
