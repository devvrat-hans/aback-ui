"use client";

import { useState } from "react";
import {
  IconArchive,
  IconCopy,
  IconDots,
  IconDownload,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownMenuExample() {
  const [showArchived, setShowArchived] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Project actions">
          <IconDots aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem>
          <IconCopy aria-hidden="true" />
          Duplicate
          <DropdownMenuShortcut>Ctrl D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconDownload aria-hidden="true" />
          Export data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
          Show archived
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconArchive aria-hidden="true" />
          Archive project
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <IconTrash aria-hidden="true" />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
