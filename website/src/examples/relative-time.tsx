"use client";

import { useState } from "react";

import { RelativeTime } from "@/components/ui/relative-time";

const MINUTE = 60_000;

export function RelativeTimeExample() {
  // Fixed offsets from the moment the example mounts, so the phrases are predictable.
  const [mountedAt] = useState(() => Date.now());
  const events = [
    { label: "Deployment finished", at: mountedAt - 20_000 },
    { label: "Comment added", at: mountedAt - 14 * MINUTE },
    { label: "Release tagged", at: mountedAt - 5 * 60 * MINUTE },
    { label: "Workspace created", at: mountedAt - 26 * 60 * MINUTE },
    { label: "Trial ends", at: mountedAt + 3 * 24 * 60 * MINUTE },
  ];

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ul className="divide-y divide-border border border-border">
        {events.map((event) => (
          <li key={event.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <span className="text-foreground">{event.label}</span>
            <RelativeTime date={event.at} className="text-xs text-muted-foreground" />
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        In German: <RelativeTime date={mountedAt - 5 * 60 * MINUTE} locale="de" />. In Japanese:{" "}
        <RelativeTime date={mountedAt - 5 * 60 * MINUTE} locale="ja" />. Hover a time for the exact date.
      </p>
    </div>
  );
}
