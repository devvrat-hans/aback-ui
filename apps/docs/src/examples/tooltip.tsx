"use client";

import { IconCopy, IconTrash, IconDownload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TooltipExample() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Copy link">
            <IconCopy aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Download report">
            <IconDownload aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download report</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Delete project">
            <IconTrash aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete project</TooltipContent>
      </Tooltip>
    </div>
  );
}
