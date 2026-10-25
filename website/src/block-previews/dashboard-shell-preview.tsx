"use client";

import {
  IconBox,
  IconLayoutGrid,
  IconPlus,
  IconSettings,
  IconTerminal2,
  IconUsers,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Stat, StatGrid } from "@/components/ui/stat";
import { DashboardShellBlock, type DashboardNavItem } from "@registry/blocks/dashboard-shell";

const nav: DashboardNavItem[] = [
  { title: "Overview", href: "/docs", icon: <IconLayoutGrid /> },
  { title: "Components", href: "/docs/components", icon: <IconBox />, badge: "38" },
  { title: "Blocks", href: "/docs/blocks", icon: <IconBox /> },
  { title: "CLI", href: "/docs/cli", icon: <IconTerminal2 /> },
  { title: "Installation", href: "/docs/installation", icon: <IconSettings /> },
];

const activity = [
  {
    title: "Design tokens synced",
    detail: "aback-ui · 2 minutes ago",
    status: "Success" as const,
    variant: "success" as const,
  },
  {
    title: "Registry build queued",
    detail: "aback-ui · 14 minutes ago",
    status: "Running" as const,
    variant: "secondary" as const,
  },
  {
    title: "Invite pending",
    detail: "amar@aback.group · 1 hour ago",
    status: "Pending" as const,
    variant: "warning" as const,
  },
];

export function DashboardShellPreview() {
  return (
    <DashboardShellBlock
      appName="Aback Console"
      nav={nav}
      activeHref="/docs"
      title="Overview"
      description="Example workspace. The shell is real; the numbers and activity are demo data."
      actions={
        <Button asChild size="sm">
          <a href="/docs/blocks">
            <IconPlus aria-hidden="true" />
            Browse blocks
          </a>
        </Button>
      }
      user={{ name: "Aditi Rao", email: "aditi@aback.group" }}
      accountHref="/docs/installation"
    >
      <div className="flex flex-col gap-4">
        <StatGrid columns={3}>
          <Stat
            label="Team members"
            value="48"
            icon={<IconUsers />}
            trend={{ direction: "up", label: "6 joined this month" }}
          />
          <Stat label="Components" value="56" icon={<IconBox />} hint="All installable" />
          <Stat
            label="Storage"
            value="62%"
            unit="of 50 GB"
            hint={<Progress value={62} aria-label="Storage used" className="mt-1" />}
          />
        </StatGrid>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 p-4">
            <div>
              <CardTitle as="h2" className="text-sm">
                Recent activity
              </CardTitle>
              <CardDescription>Events from this workspace.</CardDescription>
            </div>
            <Badge variant="muted">Example data</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border border-t border-border">
              {activity.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge variant={item.variant}>{item.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShellBlock>
  );
}
