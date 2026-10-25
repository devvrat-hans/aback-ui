"use client";

import { useMemo, useState } from "react";
import {
  IconArrowsSort,
  IconChevronDown,
  IconDots,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type MemberRole = "Admin" | "Editor" | "Viewer";
export type MemberStatus = "active" | "invited" | "suspended";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  lastActive: string;
}

export interface UsersTableBlockProps {
  members?: WorkspaceMember[];
  /** Renders an invite action in the toolbar when provided. */
  onInvite?: () => void;
  /** Called when a row's manage action is chosen. */
  onManage?: (member: WorkspaceMember) => void;
}

const DEMO_MEMBERS: WorkspaceMember[] = [
  { id: "1", name: "Aditi Rao", email: "aditi@aback.com", role: "Admin", status: "active", lastActive: "2 minutes ago" },
  { id: "2", name: "Bilal Khan", email: "bilal@aback.com", role: "Editor", status: "active", lastActive: "1 hour ago" },
  { id: "3", name: "Chen Wei", email: "chen@aback.com", role: "Viewer", status: "invited", lastActive: "Invite sent" },
  { id: "4", name: "Dara Okafor", email: "dara@aback.com", role: "Editor", status: "active", lastActive: "Yesterday" },
  { id: "5", name: "Elena Rossi", email: "elena@aback.com", role: "Viewer", status: "suspended", lastActive: "3 weeks ago" },
  { id: "6", name: "Farid Haddad", email: "farid@aback.com", role: "Editor", status: "active", lastActive: "3 days ago" },
  { id: "7", name: "Grace Lee", email: "grace@aback.com", role: "Admin", status: "active", lastActive: "5 minutes ago" },
  { id: "8", name: "Hassan Ali", email: "hassan@aback.com", role: "Viewer", status: "invited", lastActive: "Invite sent" },
  { id: "9", name: "Imani Brooks", email: "imani@aback.com", role: "Viewer", status: "active", lastActive: "1 week ago" },
  { id: "10", name: "Jonas Weber", email: "jonas@aback.com", role: "Editor", status: "active", lastActive: "4 hours ago" },
  { id: "11", name: "Keiko Tanaka", email: "keiko@aback.com", role: "Viewer", status: "active", lastActive: "2 days ago" },
];

const PAGE_SIZE = 5;
const ROLES: Array<"all" | MemberRole> = ["all", "Admin", "Editor", "Viewer"];

const statusVariant = {
  active: "success",
  invited: "warning",
  suspended: "outline",
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

export function UsersTableBlock({
  members = DEMO_MEMBERS,
  onInvite,
  onManage,
}: UsersTableBlockProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | MemberRole>("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return members
      .filter((member) => {
        const matchesQuery =
          !term ||
          `${member.name} ${member.email}`.toLowerCase().includes(term);
        const matchesRole = role === "all" || member.role === role;
        return matchesQuery && matchesRole;
      })
      .sort((a, b) =>
        sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
      );
  }, [members, query, role, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function resetFilters() {
    setQuery("");
    setRole("all");
    setPage(1);
  }

  return (
    <section aria-labelledby="members-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="members-title" className="text-lg font-semibold tracking-tight text-foreground">
            Members
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {members.length} people have access to this workspace.
          </p>
        </div>
        {onInvite ? (
          <Button onClick={onInvite}>
            <IconUsers aria-hidden="true" />
            Invite member
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Search members"
            placeholder="Search name or email"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Role: {role === "all" ? "All" : role}
              <IconChevronDown aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ROLES.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => {
                  setRole(option);
                  setPage(1);
                }}
              >
                {option === "all" ? "All roles" : option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSort((currentSort) => (currentSort === "asc" ? "desc" : "asc"))}
          aria-label={`Sort by name, ${sort === "asc" ? "ascending" : "descending"}`}
        >
          <IconArrowsSort aria-hidden="true" />
          Name {sort === "asc" ? "A–Z" : "Z–A"}
        </Button>
      </div>

      <p role="status" className="sr-only">
        {copied ? `Copied ${copied} to the clipboard.` : ""}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconSearch aria-hidden="true" />}
          title="No members match"
          description="Try a different name, email, or role."
          action={
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <Table containerProps={{ "aria-label": "Workspace members" }}>
            <TableCaption className="sr-only">
              Workspace members, their role, status, and last activity.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Member</TableHead>
                <TableHead scope="col">Role</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Last active</TableHead>
                <TableHead scope="col" className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>{initials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.role}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[member.status]}>{member.status}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {member.lastActive}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`}>
                          <IconDots aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            void navigator.clipboard?.writeText(member.email);
                            setCopied(member.email);
                          }}
                        >
                          Copy email
                        </DropdownMenuItem>
                        {onManage ? (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => onManage(member)}>
                              Manage member
                            </DropdownMenuItem>
                          </>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {visible.length} of {filtered.length} members
            </p>
            <Pagination
              page={current}
              pageCount={pageCount}
              onPageChange={setPage}
              labels={{ navigation: "Member pages" }}
            />
          </div>
        </>
      )}
    </section>
  );
}
