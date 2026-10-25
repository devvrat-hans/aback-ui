"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

export function ToastExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => toast("Workspace saved")}>
        Default
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.success("Invite sent", {
            description: "ada@example.com can join the workspace.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.error("Could not publish", {
            description: "The registry returned 503. Your changes are safe.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.warning("Usage at 90%", {
            description: "Requests reset on the first of the month.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast("Invite archived", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Invite restored"),
            },
          })
        }
      >
        With action
      </Button>
    </div>
  );
}
